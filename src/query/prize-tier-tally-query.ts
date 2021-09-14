import { IQuery } from '@nestjs/cqrs'

export interface PrizeTierTallyQueryInput {
  guildId: string
  channelId: string
  startingTime: Date
}

export type PrizeTierTallyQueryOutput = {
  rank: number
  subrank?: number
  count: number
}[]

export class PrizeTierTallyQuery implements IQuery {
  constructor(readonly input: PrizeTierTallyQueryInput) {}
}
