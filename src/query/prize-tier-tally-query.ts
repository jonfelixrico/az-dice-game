import { IQuery } from '@nestjs/cqrs'

export interface WinningRollTallyQueryInput {
  guildId: string
  channelId: string
  startingTime: Date
}

export type WinningRollTallyQueryOutput = {
  rank: number
  subrank?: number
  count: number
}[]

export class WinningRollTallyQuery implements IQuery {
  constructor(readonly input: WinningRollTallyQueryInput) {}
}
