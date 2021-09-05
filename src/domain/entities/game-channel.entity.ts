import { DomainError } from '../domain-error.class'
import { RollRemovedEvent } from '../events/roll-removed.event'
import { RollRestoredEvent } from '../events/roll-restored.event'
import { SessionRollIdUpdatedEvent } from '../events/session-roll-id-updated.event'
import { BaseDomain, IBaseDomain } from './base-entity.abstract'
import { IRoll } from './user-roll.interface'

export interface IChannelRoll extends IRoll {
  isRemoved: boolean
}

export interface IGameChannel extends IBaseDomain {
  channelId: string
  guildId: string
  rolls: IChannelRoll[]
  sessionRollId: string
}

export class GameChannel extends BaseDomain implements IGameChannel {
  revision: bigint
  channelId: string
  guildId: string
  rolls: IChannelRoll[]
  sessionRollId: string

  constructor({
    revision,
    channelId,
    guildId,
    rolls,
    sessionRollId,
  }: IGameChannel) {
    super()
    this.revision = revision
    this.channelId = channelId
    this.guildId = guildId
    this.rolls = rolls
    this.sessionRollId = sessionRollId
  }

  removeRoll(rollId: string) {
    const { rolls, channelId, guildId } = this
    const roll = rolls.find((roll) => roll.rollId === rollId)

    if (!roll) {
      throw new DomainError('ROLL_NOT_FOUND')
    }

    if (roll.isRemoved) {
      throw new DomainError('ROLL_ALREADY_REMOVED')
    }

    this.apply(
      new RollRemovedEvent({
        channelId,
        guildId,
        rollId,
        timestamp: new Date(),
      })
    )

    roll.isRemoved = true
  }

  restoreRoll(rollId: string) {
    const { rolls, channelId, guildId } = this
    const roll = rolls.find((roll) => roll.rollId === rollId)

    if (!roll) {
      throw new DomainError('ROLL_NOT_FOUND')
    }

    if (!roll.isRemoved) {
      throw new DomainError('ROLL_NOT_RESTORABLE_BECAUSE_NOT_REMOVED')
    }

    this.apply(
      new RollRestoredEvent({
        channelId,
        guildId,
        rollId,
        timestamp: new Date(),
      })
    )

    roll.isRemoved = false
  }

  private setSession(rollId: string) {
    const { channelId, guildId } = this

    this.apply(
      new SessionRollIdUpdatedEvent({
        channelId,
        guildId,
        rollId,
      })
    )

    this.sessionRollId = rollId
  }

  setNewSession(rollId?: string) {
    const { rolls } = this

    if (!rolls.length) {
      throw new DomainError('NO_ROLLS_IN_CHANNEL')
    }

    if (rollId) {
      this.setSession(rollId)
      return
    }

    const lastRoll = rolls[rolls.length - 1]
    this.setSession(lastRoll.rollId)
  }
}
