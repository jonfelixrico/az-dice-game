import { EventStoreDBClient, JSONEventType } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { GameSession } from 'src/domain/entities/game-session.entity'
import { IRoll } from 'src/domain/entities/user-roll.interface'
import {
  BaseEventPayload,
  EventName,
} from 'src/domain/events/base-domain-event.interface'
import { IRollCreatedEventPayload } from 'src/domain/events/roll-created.event'
import { IRollRemovedEventPayload } from 'src/domain/events/roll-removed.event'
import { IRollRestoredEventPayload } from 'src/domain/events/roll-restored.event'

interface IBaseRoll
  extends Pick<IRollCreatedEventPayload, 'rollId'>,
    Pick<IRollRemovedEventPayload, 'rollId'>,
    Pick<IRollRestoredEventPayload, 'rollId'>,
    BaseEventPayload {}

@Injectable()
export class GameSessionRepositoryService {
  constructor(private client: EventStoreDBClient) {}

  async findByGuildChannel(
    guildId: string,
    channelId: string
  ): Promise<GameSession> {
    const restorePool = new Set<string>()
    const removePool = new Set<string>()

    let lastRoll: IRoll
    let lastRev: bigint

    const stream = this.client.readStream<JSONEventType<EventName, IBaseRoll>>(
      [guildId, channelId].join('/'),
      {
        direction: 'backwards',
        fromRevision: 'end',
      }
    )

    for await (const { event } of stream) {
      const { type, data, revision } = event

      if (lastRev ?? true) {
        lastRev = revision
      }

      if (lastRoll) {
        break
      }

      const { rollId } = data

      if (type === 'ROLL_REMOVED') {
        if (restorePool.has(rollId)) {
          restorePool.delete(rollId)
          continue
        }

        removePool.add(rollId)
      } else if (type === 'ROLL_RESTORED') {
        restorePool.add(rollId)
      } else if (type === 'ROLL_CREATED') {
        if (removePool.has(rollId)) {
          continue
        }

        lastRoll = data as IRollCreatedEventPayload
      }
    }

    return new GameSession({
      channelId,
      guildId,
      lastRoll,
      revision: lastRev,
    })
  }
}
