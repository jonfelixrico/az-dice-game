import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export interface RollHistoryQueryInput extends ChannelHistoryQueryParams {
  excludeDeleted?: boolean
}

export interface RollHistoryQueryOutputItem extends ChannelRoll {
  deleted?: {
    timestamp: Date
    userId: string
  }
}

export type RollHistoryQueryOutput = RollHistoryQueryOutputItem[]

export class RollHistoryQuery implements IQuery {
  constructor(readonly input: RollHistoryQueryInput) {}
}
