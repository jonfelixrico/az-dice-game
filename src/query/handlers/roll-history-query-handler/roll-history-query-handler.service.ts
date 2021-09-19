import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { ChannelCutoffTimestampQuery } from 'src/query/channel-cutoff-timestamp.query'
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
  constructor(private typeorm: Connection, private queryBus: QueryBus) {}

  async execute({ input }: RollHistoryQuery): Promise<RollHistoryQueryOutput> {
    const { excludeDeleted } = input
    const channelInput = pick(input, 'channelId', 'guildId')

    const startingFrom: Date =
      input.startingFrom ??
      (await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({
          ...channelInput,
          useOriginDateIfNotFound: true,
        })
      ))

    const findConditions: FindConditions<RollDbEntity> = {
      ...channelInput,
      timestamp: MoreThanOrEqual(startingFrom),
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
