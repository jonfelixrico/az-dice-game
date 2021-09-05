import { random } from 'lodash'
import { DomainError } from '../domain-error.class'
import { BaseDomain } from './base-entity.class'
import { DiceRoll, IUserRoll } from './user-roll.interface'

function rollD6(): DiceRoll {
  return new Array(6).fill(null).map(() => random(1, 6)) as DiceRoll
}

type LastRoll = IUserRoll | null

export interface IGameSession {
  channelId: string
  guildId: string
  lastRoll: LastRoll
}

export class GameSession extends BaseDomain implements IGameSession {
  channelId: string
  guildId: string
  lastRoll: LastRoll

  rollNatural(userId: string) {
    const { lastRoll } = this

    if (lastRoll && lastRoll.userId === userId) {
      throw new DomainError('USER_WAS_LAST_ROLL')
    }

    const newLastRoll: IUserRoll = {
      userId,
      type: 'NATURAL',
      roll: rollD6(),
      timestamp: new Date(),
    }
  }
}
