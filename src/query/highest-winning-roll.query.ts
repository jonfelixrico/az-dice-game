import { IQuery } from '@nestjs/cqrs'

export interface HighestWinningRollQueryInput {
  guildId: string
  channelId: string
  startingTime?: Date
}

export interface HighestWinningRollQueryOutput {
  rank: number
  subrank?: number
  rollOwner: string
  roll: number[]
  timestamp: Date
}

export class HighestWinningRollQuery implements IQuery {
  constructor(readonly input: HighestWinningRollQueryInput) {}
}
