import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  RollHistoryQuery,
  RollHistoryQueryOutput,
  RollHistoryQueryOutputItem,
} from 'src/query/roll-history.query'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, MoreThanOrEqual } from 'typeorm'

function rollFormatFn({
  roll,
  rollOwner,
  rolledBy,
  prizeRank: rank,
  prizePoints: points,
  timestamp,
  deleteBy,
  deleteDt,
  rollId,
}: RollDbEntity): RollHistoryQueryOutputItem {
  const formatted: RollHistoryQueryOutputItem = {
    roll,
    rollOwner,
    rolledBy,
    rank,
    points,
    timestamp,
    rollId,
  }

  if (deleteDt) {
    formatted.deleted = {
      timestamp: deleteDt,
      userId: deleteBy,
    }
  }

  return formatted
}

@QueryHandler(RollHistoryQuery)
export class RollHistoryQueryHandlerService
  implements IQueryHandler<RollHistoryQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({ input }: RollHistoryQuery): Promise<RollHistoryQueryOutput> {
    const { channelId, guildId, startingFrom } = input

    const findConditions: FindConditions<RollDbEntity> = {
      channelId,
      guildId,
      timestamp: startingFrom && MoreThanOrEqual(startingFrom),
    }

    const rolls = await this.typeorm.getRepository(RollDbEntity).find({
      where: findConditions,
      order: {
        timestamp: 'ASC',
      },
    })

    return rolls.map(rollFormatFn)
  }
}
