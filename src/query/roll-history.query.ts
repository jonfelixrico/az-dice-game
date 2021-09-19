import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export interface RollHistoryQueryInput extends ChannelHistoryQueryParams {
  excludeDeleted?: boolean
}

export type RollHistoryQueryOutputItem = ChannelRoll
export type RollHistoryQueryOutput = RollHistoryQueryOutputItem[]

export class RollHistoryQuery implements IQuery {
  constructor(readonly input: RollHistoryQueryInput) {}
}
