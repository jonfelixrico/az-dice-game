import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export type LastRollQueryInput = ChannelHistoryQueryParams
export type LastRollQueryOutput = ChannelRoll
export class LastRollQuery implements IQuery {
  constructor(readonly input: LastRollQueryInput) {}
}
