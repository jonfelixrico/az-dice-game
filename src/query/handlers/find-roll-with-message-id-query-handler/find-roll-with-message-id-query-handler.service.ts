import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  FindRollWithMessageIdQuery,
  FindRollWitHmessageIdQueryOutput,
} from 'src/query/find-roll-with-message-id.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection } from 'typeorm'

@QueryHandler(FindRollWithMessageIdQuery)
export class FindRollWithMessageIdQueryHandlerService
  implements IQueryHandler<FindRollWithMessageIdQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({
    input,
  }: FindRollWithMessageIdQuery): Promise<FindRollWitHmessageIdQueryOutput> {
    const { messageId } = input

    const roll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: {
        messageId,
      },
    })

    return roll ? formatRollRecordToQueryOutput(roll) : null
  }
}
