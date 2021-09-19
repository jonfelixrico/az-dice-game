import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  RollHistoryQuery,
  RollHistoryQueryOutput,
} from 'src/query/roll-history.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThanOrEqual } from 'typeorm'

@QueryHandler(RollHistoryQuery)
export class RollHistoryQueryHandlerService
  implements IQueryHandler<RollHistoryQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({ input }: RollHistoryQuery): Promise<RollHistoryQueryOutput> {
    const { channelId, guildId, startingFrom, excludeDeleted } = input

    const findConditions: FindConditions<RollDbEntity> = {
      channelId,
      guildId,
    }

    if (startingFrom) {
      findConditions.timestamp = MoreThanOrEqual(startingFrom)
    }

    if (excludeDeleted) {
      findConditions.deleteBy = IsNull()
    }

    const rolls = await this.typeorm.getRepository(RollDbEntity).find({
      where: findConditions,
      order: {
        timestamp: 'ASC',
      },
    })

    return rolls.map(formatRollRecordToQueryOutput)
  }
}
