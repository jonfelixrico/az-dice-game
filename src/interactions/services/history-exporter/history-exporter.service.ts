import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Client, GuildMember, Interaction } from 'discord.js'
import { chain, keyBy } from 'lodash'
import {
  RollHistoryQuery,
  RollHistoryQueryInput,
  RollHistoryQueryOutput,
  RollHistoryQueryOutputItem,
} from 'src/query/roll-history.query'
import { PrizeTier, PRIZE_TIERS } from 'src/utils/prize-tier'
import { utils, WorkSheet, write } from 'xlsx'

interface PrizeTierGroup {
  name: string
  rank: number
  subrank?: number
  rolls: RollHistoryQueryOutputItem[]
}

interface HistoryStreamItem extends RollHistoryQueryOutputItem {
  tierName?: string
}

interface ChannelHistory {
  grouped: PrizeTierGroup[]
  rolls: RollHistoryQueryOutputItem[]
}

interface TierProps {
  rank?: number
  subrank?: number
}

const keyFn = ({ rank, subrank }: TierProps) =>
  [rank ?? 0, subrank ?? 0].join('/')

function generateGroups(
  history: RollHistoryQueryOutputItem[]
): PrizeTierGroup[] {
  const grouped = chain(history)
    .filter(({ rank }) => !!rank)
    .groupBy(keyFn)
    .value()

  return PRIZE_TIERS.concat()
    .reverse()
    .map((tier) => {
      const { name, rank, subrank } = tier
      return {
        name,
        rank,
        subrank,
        rolls: grouped[keyFn(tier)] || [],
      }
    })
}

function generateHistoryStream(
  history: RollHistoryQueryOutputItem[]
): HistoryStreamItem[] {
  const tierMap = keyBy<PrizeTier>(PRIZE_TIERS, keyFn)

  return history.map<HistoryStreamItem>((roll) => {
    if (!roll.rank) {
      return roll
    }

    return {
      ...roll,
      tierName: tierMap[keyFn(roll)]?.name,
    }
  })
}

interface SheetToAdd {
  sheet: WorkSheet
  name: string
}

interface ResolvedRoll extends RollHistoryQueryOutputItem {
  username: string
  nickname: string
}

type MemberResolver = (userId: string) => Promise<GuildMember>

@Injectable()
export class HistoryExporterService {
  constructor(private queryBus: QueryBus, private client: Client) {}

  private async guildUserIdResolverFactory(
    guildId: string
  ): Promise<MemberResolver> {
    const { client } = this

    return async (userId: string) => {
      const guild = await client.guilds.fetch(guildId)
      if (!guild) {
        return null
      }

      return await guild.members.fetch(userId)
    }
  }

  private async fetchChannelHistory(
    input: RollHistoryQueryInput
  ): Promise<ResolvedRoll[]> {
    const history: RollHistoryQueryOutput = await this.queryBus.execute(
      new RollHistoryQuery(input)
    )
    const userResolver = await this.guildUserIdResolverFactory(input.guildId)

    const results: ResolvedRoll[] = []

    for (const entry of history) {
      const user = await userResolver(entry.rollOwner)
      results.push({
        ...entry,
        nickname: user?.nickname,
        username: user?.user?.username,
      })
    }

    return results
  }

  private async fetchAndFormatHistory(
    input: RollHistoryQueryInput
  ): Promise<ChannelHistory> {
    const history = await this.queryBus.execute(new RollHistoryQuery(input))

    return {
      grouped: generateGroups(history),
      rolls: history,
    }
  }

  private generateHistoryStreamSheet(
    rolls: RollHistoryQueryOutputItem[]
  ): WorkSheet {
    const streamFormat = generateHistoryStream(rolls).map(
      ({ roll, rollOwner, deleted, tierName, timestamp }) => {
        return {
          roll: roll.sort().join(''),
          user: rollOwner, // TODO convert this to the guild nickname
          deleted: deleted ? 'YES' : 'NO',
          prize: tierName,
          timestamp: timestamp.toISOString(),
        }
      }
    )

    const headers = ['timestamp', 'user', 'roll', 'prize', 'deleted']

    return utils.json_to_sheet(streamFormat, {
      header: headers,
    })
  }

  private generatePrizeHistory(rolls: RollHistoryQueryOutputItem[]): WorkSheet {
    const streamFormat = rolls.map(
      ({ roll, rollOwner, deleted, timestamp }) => {
        return {
          roll: roll.sort().join(''),
          user: rollOwner, // TODO convert this to the guild nickname
          deleted: deleted ? 'YES' : 'NO',
          timestamp: timestamp.toISOString(),
        }
      }
    )

    const headers = ['timestamp', 'user', 'roll', 'deleted']

    return utils.json_to_sheet(streamFormat, {
      header: headers,
    })
  }

  private async generateSpreadsheet({ rolls, grouped }: ChannelHistory) {
    const sheets: SheetToAdd[] = []
    sheets.push({
      name: 'Overview',
      sheet: this.generateHistoryStreamSheet(rolls),
    })

    for (const { rolls, name } of grouped) {
      sheets.push({
        name,
        sheet: this.generatePrizeHistory(rolls),
      })
    }

    const workBook = utils.book_new()
    sheets.forEach(({ name, sheet }, index) => {
      utils.book_append_sheet(workBook, sheet, [index, name].join('-'))
    })

    return write(workBook, {
      type: 'buffer',
    }) as Buffer
  }

  async exportData({ channelId, guildId }: Interaction) {
    const history = await this.fetchAndFormatHistory({ channelId, guildId })
    return this.generateSpreadsheet(history)
  }
}
