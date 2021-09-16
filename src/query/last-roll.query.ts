import { IQuery } from '@nestjs/cqrs'

export interface LastRollQueryInput {
  guildId: string
  channelId: string

  // providing this will only include rolls starting form the specified datetime; exclusive
  startingFrom?: Date
}

export interface LastRollQueryOutput {
  rank: number
  subrank?: number
  rollOwner: string
  roll: number[]
  rolledBy: string
  timestamp: Date
}

export class LastRollQuery implements IQuery {
  constructor(readonly input: LastRollQueryInput) {}
}
