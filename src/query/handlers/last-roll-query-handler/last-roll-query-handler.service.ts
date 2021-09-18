import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { ChannelCutoffTimestampQuery } from 'src/query/channel-cutoff-timestamp.query'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThanOrEqual } from 'typeorm'

@QueryHandler(LastRollQuery)
export class LastRollQueryHandlerService
  implements IQueryHandler<LastRollQuery>
{
  constructor(private typeorm: Connection, private queryBus: QueryBus) {}

  async execute({ input }: LastRollQuery): Promise<LastRollQueryOutput> {
    const channelParams = pick(input, ['guildId', 'channelId'])
    const startingFrom: Date =
      input.startingFrom ??
      (await this.queryBus.execute(
        new ChannelCutoffTimestampQuery(channelParams)
      ))

    const findConditions: FindConditions<RollDbEntity> = {
      ...channelParams,
      deleteDt: IsNull(),
      timestamp: startingFrom && MoreThanOrEqual(startingFrom),
    }

    const lastRoll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: findConditions,
      order: {
        timestamp: 'DESC',
      },
    })

    return lastRoll ? formatRollRecordToQueryOutput(lastRoll) : null
  }
}
