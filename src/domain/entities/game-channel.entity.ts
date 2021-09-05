import { BaseDomain, IBaseDomain } from './base-entity.abstract'
import { IRoll } from './user-roll.interface'

export interface IChannelRoll extends IRoll {
  isRemoved: boolean
}

export interface IGameChannel extends IBaseDomain {
  channelId: string
  guildId: string
  rolls: IChannelRoll[]
}

export class GameChannel extends BaseDomain implements IGameChannel {
  revision: bigint
  channelId: string
  guildId: string
  rolls: IChannelRoll[]

  constructor({ revision, channelId, guildId, rolls }: IGameChannel) {
    super()
    this.revision = revision
    this.channelId = channelId
    this.guildId = guildId
    this.rolls = rolls
  }
}
