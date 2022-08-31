import { EventStoreDBClient, JSONRecordedEvent } from '@eventstore/db-client'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Connection } from 'typeorm'
import { EntryDbEntity } from '../../entities/entry.db-entity'
import { ReducerFn, REDUCERS } from './reducers'
import { sprintf } from 'sprintf-js'
import { EventBus } from '@nestjs/cqrs'
import { ReadModelConsumedEvent } from '../../read-model-consumed.event'

const COMMIT = 'COMMIT'

/**
 * This service is in charge of watching changes in our ESDB instance and then applying those changes
 * to our read model via the reducers that we've defined.
 *
 * Emits an event whenever we've succesfully consumed an event.
 */
@Injectable()
export class CatchUpService implements OnApplicationBootstrap {
  constructor(
    private esdb: EventStoreDBClient,
    private typeorm: Connection,
    private logger: Logger,
    private eventBus: EventBus
  ) {}

  private async saveCommit(commit: bigint) {
    await this.typeorm.getRepository(EntryDbEntity).save({
      value: commit.toString(),
      key: COMMIT,
    })
  }

  private async getCommit(): Promise<bigint | null> {
    const entry = await this.typeorm.getRepository(EntryDbEntity).findOne({
      where: {
        key: COMMIT,
      },
    })

    return entry ? BigInt(entry.value) : null
  }

  private async getTargetCommit(): Promise<bigint | null> {
    const stream = this.esdb.readAll({
      direction: 'backwards',
      maxCount: 1,
    })

    for await (const evt of stream) {
      return evt.commitPosition
    }

    return null
  }

  private async runReducer(reducerFn: ReducerFn, event: JSONRecordedEvent) {
    const { typeorm } = this
    return await typeorm.transaction<boolean>(
      async (manager) => await reducerFn(event, manager)
    )
  }

  private async doCatchUp() {
    const { esdb, logger } = this
    const startingCommit = await this.getCommit()
    const targetCommit = await this.getTargetCommit()

    const stream = esdb.subscribeToAll({
      fromPosition: startingCommit
        ? {
            commit: startingCommit,
            prepare: startingCommit,
          }
        : 'start',
    })

    for await (const { commitPosition, event } of stream) {
      const { streamId, isJson, revision, type } = event
      try {
        await this.saveCommit(commitPosition)

        if (targetCommit === commitPosition) {
          logger.debug(
            sprintf(
              'Skipped %s: matching commitPosition with initial.',
              commitPosition
            ),
            CatchUpService.name
          )
          continue
        }

        if (
          // to ignore esdb server events
          streamId.startsWith('$') ||
          !isJson ||
          // fromPosition is inclusive, so we're doing this to prevent duplicates
          commitPosition === startingCommit
        ) {
          logger.debug(
            sprintf('Skipped %s: server event', commitPosition),
            CatchUpService.name
          )
          continue
        }

        const reducer = REDUCERS[type]
        if (!reducer) {
          continue
        }

        const successful = await this.runReducer(
          reducer,
          event as JSONRecordedEvent
        )

        if (successful) {
          logger.verbose(
            sprintf(
              'Processed %s -- %s/%s/%s',
              commitPosition,
              streamId,
              type,
              revision
            ),
            CatchUpService.name
          )

          this.eventBus.publish(new ReadModelConsumedEvent(event))
        } else {
          logger.verbose(
            sprintf(
              'Failed processing %s -- %s/%s/%s',
              commitPosition,
              streamId,
              type,
              revision
            ),
            CatchUpService.name
          )
        }
      } catch (e) {
        this.logger.error(e.message, e.stack, CatchUpService.name)
      }
    }
  }

  onApplicationBootstrap() {
    // we're not calling this as async because we want this to happen at the background
    this.doCatchUp()
  }
}
