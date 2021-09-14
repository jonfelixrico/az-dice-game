import { IQuery } from '@nestjs/cqrs'

export interface PrizeTierTallyQueryInput {
  guildId: string
  channelId: string
  startingTime?: Date
}

export interface PrizeTierTallyEntry {
  rank: number
  subrank: number | null
  count: number
}

export type PrizeTierTallyQueryOutput = PrizeTierTallyEntry[]

export class PrizeTierTallyQuery implements IQuery {
  constructor(readonly input: PrizeTierTallyQueryInput) {}
}
