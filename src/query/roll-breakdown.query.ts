import { IQuery } from '@nestjs/cqrs'
import { PrizeTier } from 'src/utils/prize-eval'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

interface AugmentedChannelRoll extends ChannelRoll {
  excludeFromPrize: boolean
}

export type RollBreakdownQueryOutput = {
  [key in PrizeTier]: AugmentedChannelRoll[]
} & {
  ALL: AugmentedChannelRoll[]
}

export interface RollBreakdownQueryInput extends ChannelHistoryQueryParams {
  prizeLimits?: {
    [key in PrizeTier]: number
  }
}

export class RollBreakdownQuery implements IQuery {
  constructor(readonly input: RollBreakdownQueryInput) {}
}
