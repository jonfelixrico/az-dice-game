import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  HighestWinningRollQuery,
  HighestWinningRollQueryOutput,
} from 'src/query/highest-winning-roll.query'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThan, Not } from 'typeorm'

@QueryHandler(HighestWinningRollQuery)
export class HighestWinningRollQueryHandlerService
  implements IQueryHandler<HighestWinningRollQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({
    input,
  }: HighestWinningRollQuery): Promise<HighestWinningRollQueryOutput> {
    const { channelId, guildId, startingTime } = input

    const findConditions: FindConditions<RollDbEntity> = {
      channelId,
      guildId,
      prizeRank: Not(IsNull()),
      deleteDt: IsNull(),
    }

    if (startingTime) {
      findConditions.timestamp = MoreThan(startingTime)
    }

    const highest = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: findConditions,
      order: {
        timestamp: 'DESC',
      },
    })

    if (!highest) {
      return null
    }

    const { rollOwner, roll, prizeRank, prizeSubrank, timestamp } = highest

    return {
      roll,
      rank: prizeRank,
      subrank: prizeSubrank,
      rollOwner,
      timestamp,
    }
  }
}
