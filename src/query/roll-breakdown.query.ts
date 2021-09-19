import { IQuery } from '@nestjs/cqrs'
import { PrizeTier } from 'src/utils/prize-eval'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export interface RollBreakdownQueryOutputItem extends ChannelRoll {
  excludeFromPrize: boolean
}

export type RollBreakdownQueryOutput = {
  [key in PrizeTier]: RollBreakdownQueryOutputItem[]
} & {
  ALL: RollBreakdownQueryOutputItem[]
}

export interface RollBreakdownQueryInput extends ChannelHistoryQueryParams {
  prizeLimits?: {
    [key in PrizeTier]: number
  }
}

export class RollBreakdownQuery implements IQuery {
  constructor(readonly input: RollBreakdownQueryInput) {}
}
