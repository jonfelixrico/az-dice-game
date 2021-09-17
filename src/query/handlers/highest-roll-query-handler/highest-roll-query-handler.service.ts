import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { HighestRollQuery } from 'src/query/highest-roll.query'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection } from 'typeorm'

@QueryHandler(HighestRollQuery)
export class HighestRollQueryHandlerService
  implements IQueryHandler<HighestRollQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({ input }: HighestRollQuery): Promise<any> {
    const { channelId, guildId, startingFrom } = input

    let builder = this.typeorm
      .getRepository(RollDbEntity)
      .createQueryBuilder()
      .where('"channelId" = :channelId', { channelId })
      .andWhere('"guildId = :guildId"', { guildId })
      .andWhere('"deleteDt" IS NULL')
      .andWhere('"prizeRank" IS NOT NULL')

    if (startingFrom) {
      builder = builder.andWhere('timestamp > :startingFrom', {
        startingFrom,
      })
    }

    builder.orderBy('"prizeRank"', 'DESC')
    builder.addOrderBy('"prizePoints"', 'DESC')
    builder.addOrderBy('"timestamp"', 'ASC')

    const highestRoll = await builder.getOne()
    if (!highestRoll) {
      return null
    }

    const {
      roll,
      rollOwner,
      rolledBy,
      prizeRank: rank,
      prizePoints: points,
      timestamp,
    } = highestRoll

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
