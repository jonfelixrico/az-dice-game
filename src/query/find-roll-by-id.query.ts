import { IQuery } from '@nestjs/cqrs'
import { ChannelRoll } from './commons.interfaces'

export interface FindRollByIdQueryInput {
  rollId: string
}

export type FindRollByIdQueryOutput = ChannelRoll

export class FindRollByIdQuery implements IQuery {
  constructor(readonly input: FindRollByIdQueryInput) {}
}
