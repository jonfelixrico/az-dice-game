import { EventStoreDBClient, JSONEventType } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { GameSession } from 'src/domain/entities/game-session.entity'
import { IUserRoll } from 'src/domain/entities/user-roll.interface'

export interface IPartialUserRoll extends Record<string | number, unknown> {
  rollId: string
  userId: string
}

interface EsdbUserRoll extends IUserRoll, Record<string, unknown> {}

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

    const resolvedEvts = this.client.readStream<
      JSONEventType<string, IPartialUserRoll | EsdbUserRoll>
    >([guildId, channelId].join('/'), {
      direction: 'backwards',
      // TODO implement full pagination
      maxCount: 1000,
      fromRevision: 'end',
    })

    for await (const { event } of resolvedEvts) {
      const { type, data, revision } = event
      if (lastRev ?? true) {
        lastRev = revision
      }

      const { rollId } = data

      switch (type) {
        case 'ROLL_REMOVED': {
          if (restorePool.has(rollId)) {
            restorePool.delete(rollId)
            break
          }

          removePool.add(rollId)
          break
        }

        case 'ROLL_RESTORED': {
          restorePool.add(rollId)
          break
        }

        case 'ROLL_CREATED': {
          if (removePool.has(rollId)) {
            break
          }

          lastRoll = data as EsdbUserRoll
          break
        }
      }

      if (lastRoll) {
        break
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
