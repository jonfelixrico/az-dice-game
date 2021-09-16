import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams } from './commons.interfaces'

export type PrizeTierTallyQueryInput = ChannelHistoryQueryParams

export interface PrizeTierTallyEntry {
  rank: number
  subrank: number | null
  count: number
}

export type PrizeTierTallyQueryOutput = PrizeTierTallyEntry[]

export class PrizeTierTallyQuery implements IQuery {
  constructor(readonly input: PrizeTierTallyQueryInput) {}
}
