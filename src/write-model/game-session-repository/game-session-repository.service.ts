import { EventStoreDBClient, JSONEventType } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { GameSession } from 'src/domain/entities/game-session.entity'
import { IUserRoll } from 'src/domain/entities/user-roll.interface'
import { EventName } from 'src/domain/events/base-domain-event.interface'

interface IBaseRoll extends Record<string | number, unknown> {
  rollId: string
}

interface EsdbUserRoll extends IUserRoll, IBaseRoll {}

@Injectable()
export class GameSessionRepositoryService {
  constructor(private client: EventStoreDBClient) {}

  async findByGuildChannel(
    guildId: string,
    channelId: string
  ): Promise<GameSession> {
    const restorePool = new Set<string>()
    const removePool = new Set<string>()

    let lastRoll: IUserRoll
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

        lastRoll = data as EsdbUserRoll
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
