import { EventStoreDBClient, JSONRecordedEvent } from '@eventstore/db-client'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Connection } from 'typeorm'
import { EntryDbEntity } from '../entities/entry.db-entity'
import { ReducerFn, REDUCERS } from './reducers'

const COMMIT = 'COMMIT'

@Injectable()
export class CatchUpService implements OnApplicationBootstrap {
  constructor(private esdb: EventStoreDBClient, private typeorm: Connection) {}

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
    await typeorm.transaction<void>(
      async (manager) => await reducerFn(event, manager)
    )
  }

  private async doCatchUp() {
    const { esdb } = this
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
      try {
        await this.saveCommit(commitPosition)

        if (targetCommit === commitPosition) {
          // TODO emit an event here, add logging
        }

        if (
          // to ignore esdb server events
          event.streamId.startsWith('$') ||
          !event.isJson ||
          // fromPosition is inclusive, so we're doing this to prevent duplicates
          commitPosition === startingCommit
        ) {
          continue
        }

        const reducer = REDUCERS[event.type]
        if (!reducer) {
          continue
        }

        await this.runReducer(reducer, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  onApplicationBootstrap() {
    // we're not calling this as async because we want this to happen at the background
    this.doCatchUp()
  }
}
