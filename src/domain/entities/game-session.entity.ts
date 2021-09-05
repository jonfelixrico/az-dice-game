import { random } from 'lodash'
import { nanoid } from 'nanoid'
import { DomainError } from '../domain-error.class'
import { RollCreatedEvent } from '../events/roll-created.event'
import { BaseDomain, IBaseDomain } from './base-entity.abstract'
import { DiceRoll, IRoll } from './user-roll.interface'

function rollD6(): DiceRoll {
  return new Array(6).fill(null).map(() => random(1, 6)) as DiceRoll
}

type LastRoll = IRoll | null

export interface IGameSession extends IBaseDomain {
  channelId: string
  guildId: string
  lastRoll: LastRoll
}

interface IDoRollInput
  extends Pick<IRoll, 'rollExecutor' | 'rollOwner' | 'type'> {
  roll?: DiceRoll
}

export class GameSession extends BaseDomain implements IGameSession {
  channelId: string
  guildId: string
  lastRoll: LastRoll
  revision: bigint

  constructor({ channelId, guildId, lastRoll, revision }: IGameSession) {
    super()
    this.channelId = channelId
    this.guildId = guildId
    this.lastRoll = lastRoll
    this.revision = revision
  }

  private doRoll({ roll, ...others }: IDoRollInput) {
    const { guildId, channelId } = this

    const newLastRoll: IRoll = {
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
