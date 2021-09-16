import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { chain } from 'lodash'
import {
  RollHistoryQuery,
  RollHistoryQueryInput,
  RollHistoryQueryOutputItem,
} from 'src/query/roll-history.query'
import { PRIZE_TIERS } from 'src/utils/prize-tier'

interface PrizeTierGroup {
  name: string
  rank: number
  subrank?: number
  rolls: RollHistoryQueryOutputItem[]
}

interface ChannelHistory {
  grouped: PrizeTierGroup[]
  rolls: RollHistoryQueryOutputItem[]
}

function generateGroups(
  history: RollHistoryQueryOutputItem[]
): PrizeTierGroup[] {
  const grouped = chain(history)
    .filter(({ rank }) => !!rank)
    .groupBy(({ rank, subrank }) => [rank ?? 0, subrank ?? 0].join('/'))
    .value()

  return PRIZE_TIERS.concat()
    .reverse()
    .map(({ name, rank, subrank }) => {
      const key = [rank ?? 0, subrank ?? 0].join('/')
      return {
        name,
        rank,
        subrank,
        rolls: grouped[key] || [],
      }
    })
}

@Injectable()
export class HistoryExporterService {
  constructor(private queryBus: QueryBus) {}

  private async fetchAndFormatHistory(
    input: RollHistoryQueryInput
  ): Promise<ChannelHistory> {
    const history = await this.queryBus.execute(new RollHistoryQuery(input))
    return {
      grouped: generateGroups(history),
      rolls: history,
    }
  }
}
