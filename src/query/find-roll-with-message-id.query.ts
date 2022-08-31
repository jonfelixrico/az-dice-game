import { IQuery } from '@nestjs/cqrs'
import { ChannelRoll } from './commons.interfaces'

export interface FindRollWithMessageIdQueryInput {
  messageId: string
}

export type FindRollWitHmessageIdQueryOutput = ChannelRoll

export class FindRollWithMessageIdQuery implements IQuery {
  constructor(readonly input: FindRollWithMessageIdQueryInput) {}
}
