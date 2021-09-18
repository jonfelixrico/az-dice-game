import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'
import { formatRollRecordToQueryOutput } from 'src/query/utils/roll-db-entity.utils'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThanOrEqual } from 'typeorm'

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
      timestamp: startingFrom && MoreThanOrEqual(startingFrom),
    }

    const lastRoll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: findConditions,
    })

    return lastRoll ? formatRollRecordToQueryOutput(lastRoll) : null
  }
}
