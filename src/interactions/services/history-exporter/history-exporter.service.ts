import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Client, GuildMember, Interaction } from 'discord.js'
import { keyBy } from 'lodash'
import {
  RollHistoryQuery,
  RollHistoryQueryInput,
  RollHistoryQueryOutput,
  RollHistoryQueryOutputItem,
} from 'src/query/roll-history.query'
import { PrizeTier, PRIZE_TIERS } from 'src/utils/prize-tier'
import { utils, WorkSheet, write } from 'xlsx'

interface TierProps {
  rank?: number
  subrank?: number
}

const keyFn = ({ rank, subrank }: TierProps) =>
  [rank ?? 0, subrank ?? 0].join('/')

interface SheetToAdd {
  sheet: WorkSheet
  name: string
}

interface ResolvedRoll extends RollHistoryQueryOutputItem {
  userName: string
  prizeName: string
}

type MemberResolver = (userId: string) => Promise<GuildMember>

@Injectable()
export class HistoryExporterService {
  constructor(private queryBus: QueryBus, private client: Client) {}

  private async guildMemberResolverFactory(
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

    const tierMap = keyBy<PrizeTier>(PRIZE_TIERS, keyFn)
    const memberResolver = await this.guildMemberResolverFactory(input.guildId)

    const results: ResolvedRoll[] = []

    for (const record of history) {
      const member = await memberResolver(record.rollOwner)
      const tier = tierMap[keyFn(record)]

      results.push({
        ...record,
        userName: member?.nickname || member?.user.username,
        prizeName: tier?.name,
      })
    }

    return results
  }

  private generateHistorySheet(rolls: ResolvedRoll[]): WorkSheet {
    const streamFormat = rolls.map(
      ({ roll, userName, deleted, prizeName, timestamp }) => {
        return {
          roll: roll.sort().join(''),
          user: userName,
          timestamp: timestamp.toISOString(), // TODO add more user-friendly formatting
          remarks: !deleted ? prizeName ?? '' : 'DELETED',
        }
      }
    )

    const headers = ['timestamp', 'user', 'roll', 'remarks']

    return utils.json_to_sheet(streamFormat, {
      header: headers,
    })
  }

  private generatePrizeSheet(rolls: ResolvedRoll[]): WorkSheet {
    const streamFormat = rolls.map(({ roll, userName, timestamp }) => {
      return {
        roll: roll.sort().join(''),
        user: userName,
        timestamp: timestamp.toISOString(),
      }
    })

    const headers = ['timestamp', 'user', 'roll']

    return utils.json_to_sheet(streamFormat, {
      header: headers,
    })
  }

  private async generateSpreadsheet(rolls: ResolvedRoll[]) {
    const sheets: SheetToAdd[] = []
    sheets.push({
      name: 'Overview',
      sheet: this.generateHistorySheet(rolls),
    })

    const prizeSheets: SheetToAdd[] = PRIZE_TIERS.map((tier) => {
      const isolatedRolls = rolls.filter((roll) => {
        return (
          !roll.deleted &&
          roll.rank &&
          roll.rank === tier.rank &&
          (roll.rank ?? 0) === (tier.subrank ?? 0)
        )
      })

      return {
        sheet: this.generatePrizeSheet(isolatedRolls),
        name: tier.name,
      }
    })

    sheets.push(...prizeSheets)

    const workBook = utils.book_new()
    sheets.forEach(({ name, sheet }, index) => {
      utils.book_append_sheet(workBook, sheet, [index, name].join('-'))
    })

    return write(workBook, {
      type: 'buffer',
    }) as Buffer
  }

  async exportData({ channelId, guildId }: Interaction) {
    const history = await this.fetchChannelHistory({ channelId, guildId })
    return this.generateSpreadsheet(history)
  }
}
