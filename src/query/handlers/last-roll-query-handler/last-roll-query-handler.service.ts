import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThan } from 'typeorm'

@QueryHandler(LastRollQuery)
export class LastRollQueryHandlerService
  implements IQueryHandler<LastRollQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({ input }: LastRollQuery): Promise<LastRollQueryOutput> {
    const { channelId, guildId, startingFrom } = input

    const findConditions: FindConditions<RollDbEntity> = {
      channelId,
      guildId,
      deleteDt: IsNull(),
    }

    if (startingFrom) {
      findConditions.timestamp = MoreThan(startingFrom)
    }

    const lastRoll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: findConditions,
    })

    if (!lastRoll) {
      return null
    }

    const {
      roll,
      rollOwner,
      rolledBy,
      prizeRank: rank,
      prizePoints: points,
      timestamp,
    } = lastRoll

    return {
      roll,
      rollOwner,
      rolledBy,
      rank,
      points,
      timestamp,
    }
  }
}
