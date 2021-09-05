import { random } from 'lodash'
import { nanoid } from 'nanoid'
import { DomainError } from '../domain-error.class'
import { RollCreatedEvent } from '../events/roll-created.event'
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

interface IDoRollInput
  extends Pick<IUserRoll, 'rollExecutor' | 'rollOwner' | 'type'> {
  roll?: DiceRoll
}

export class GameSession extends BaseDomain implements IGameSession {
  channelId: string
  guildId: string
  lastRoll: LastRoll

  private doRoll({ roll, ...others }: IDoRollInput) {
    const { guildId, channelId } = this

    const newLastRoll: IUserRoll = {
      ...others,
      roll: roll ?? rollD6(),
      timestamp: new Date(),
      rollId: nanoid(),
    }

    this.apply(new RollCreatedEvent({ guildId, channelId, ...newLastRoll }))
    this.lastRoll = newLastRoll

    return newLastRoll
  }

  roll(userId: string, forceTurn: boolean) {
    const { lastRoll } = this

    if (!forceTurn && lastRoll && lastRoll.rollOwner === userId) {
      throw new DomainError('USER_WAS_LAST_ROLL')
    }

    this.doRoll({
      type: forceTurn ? 'NATURAL_OVERRIDE' : 'NATURAL',
      rollOwner: userId,
      rollExecutor: userId,
    })
  }

  proxyRoll(rollBy: string, rollFor: string) {
    this.doRoll({
      type: 'PROXY',
      rollOwner: rollFor,
      rollExecutor: rollBy,
    })
  }

  manualRoll(rollBy: string, rollFor: string, roll: DiceRoll) {
    this.doRoll({
      type: 'MANUAL',
      rollOwner: rollBy,
      rollExecutor: rollFor,
      roll,
    })
  }
}
