import { IQuery } from '@nestjs/cqrs'
import { ChannelHistoryQueryParams, ChannelRoll } from './commons.interfaces'

export type LastRollQueryInput = ChannelHistoryQueryParams
export type LastRollQueryOutput = ChannelRoll

/**
 * Queries for the last **undeleted** roll in a given channel.
 */
export class LastRollQuery implements IQuery {
  constructor(readonly input: LastRollQueryInput) {}
}
