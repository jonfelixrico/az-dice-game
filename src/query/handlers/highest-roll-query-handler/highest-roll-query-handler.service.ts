import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs'
import { ChannelCutoffTimestampQuery } from 'src/query/channel-cutoff-timestamp.query'
import {
  HighestRollQuery,
  HighestRollQueryOutput,
} from 'src/query/highest-roll.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection } from 'typeorm'

@QueryHandler(HighestRollQuery)
export class HighestRollQueryHandlerService
  implements IQueryHandler<HighestRollQuery>
{
  constructor(private typeorm: Connection, private queryBus: QueryBus) {}

  async execute({ input }: HighestRollQuery): Promise<HighestRollQueryOutput> {
    const { channelId, guildId } = input
    const startingFrom: Date =
      input.startingFrom ??
      (await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({
          channelId,
          guildId,
          useOriginDateIfNotFound: true,
        })
      ))

    let builder = this.typeorm
      .getRepository(RollDbEntity)
      .createQueryBuilder()
      .where('"channelId" = :channelId', { channelId })
      .andWhere('"guildId" = :guildId', { guildId })
      .andWhere('"deleteDt" IS NULL')
      .andWhere('"prizeRank" IS NOT NULL')

    if (startingFrom) {
      builder = builder.andWhere('timestamp >= :startingFrom', {
        startingFrom,
      })
    }

    builder.orderBy('"prizeRank"', 'DESC')
    builder.addOrderBy('"prizePoints"', 'DESC')
    builder.addOrderBy('"timestamp"', 'ASC')

    const highestRoll = await builder.getOne()
    return highestRoll ? formatRollRecordToQueryOutput(highestRoll) : null
  }
}
