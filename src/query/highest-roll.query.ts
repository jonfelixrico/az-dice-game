import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export type HighestRollQueryInput = ChannelHistoryQueryParams
export type HighestRollQueryOutput = ChannelRoll
export class HighestRollQuery implements IQuery {
  constructor(readonly input: HighestRollQueryInput) {}
}
