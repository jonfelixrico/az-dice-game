import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  PrizeTierTallyEntry,
  PrizeTierTallyQuery,
  PrizeTierTallyQueryOutput,
} from 'src/query/prize-tier-tally-query'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, FindConditions, IsNull, MoreThan, Not } from 'typeorm'

type PrizeTierMap = {
  [key: string]: PrizeTierTallyEntry
}

/**
 * @deprecated
 */
@QueryHandler(PrizeTierTallyQuery)
export class PrizeTierTallyQueryHandlerService
  implements IQueryHandler<PrizeTierTallyQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({
    input,
  }: PrizeTierTallyQuery): Promise<PrizeTierTallyQueryOutput> {
    const { channelId, guildId, startingFrom } = input

    const findConditions: FindConditions<RollDbEntity> = {
      channelId,
      guildId,
      prizeRank: Not(IsNull()),
      deleteDt: IsNull(),
    }

    if (startingFrom) {
      findConditions.timestamp = MoreThan(startingFrom)
    }

    const rolls = await this.typeorm.getRepository(RollDbEntity).find({
      where: findConditions,
    })

    const tallyMap = rolls.reduce((map, { prizeRank, prizeSubrank }) => {
      const key = [prizeRank, prizeSubrank ?? 0].join('/')
      const entry = map[key]

      if (!entry) {
        map[key] = {
          rank: prizeRank,
          subrank: prizeSubrank ?? 0,
          count: 1,
        }
      } else {
        entry.count++
      }

      return map
    }, {} as PrizeTierMap)

    return Object.values(tallyMap)
  }
}
