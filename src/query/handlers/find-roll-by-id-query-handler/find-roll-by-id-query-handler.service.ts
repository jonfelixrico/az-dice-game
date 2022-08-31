import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  FindRollByIdQuery,
  FindRollByIdQueryOutput,
} from 'src/query/find-roll-by-id.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection } from 'typeorm'

@QueryHandler(FindRollByIdQuery)
export class FindRollByIdQueryHandlerService
  implements IQueryHandler<FindRollByIdQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({
    input,
  }: FindRollByIdQuery): Promise<FindRollByIdQueryOutput> {
    const roll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: {
        rollId: input.rollId,
      },
    })

    return roll ? formatRollRecordToQueryOutput(roll) : null
  }
}
