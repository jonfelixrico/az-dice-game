import { IQuery } from '@nestjs/cqrs'
import { PrizeTier } from 'src/utils/prize-eval'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export interface RollBreakdownQueryOutputItem extends ChannelRoll {
  excludeFromPrize: boolean
}

export type RollBreakdownQueryOutputGroups = {
  /**
   * If the prize tier is not included, then that means that no rolls fell into that rank
   */
  [key in PrizeTier]?: RollBreakdownQueryOutputItem[]
}

export type RollBreakdownQueryOutput = RollBreakdownQueryOutputGroups & {
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
