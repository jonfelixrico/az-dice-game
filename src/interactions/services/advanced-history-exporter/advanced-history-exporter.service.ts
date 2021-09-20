import { Injectable } from '@nestjs/common'
import { Client } from 'discord.js'
import { DateTime } from 'luxon'
import {
  PrizeLimits,
  RollBreakdownQueryOutput,
  RollBreakdownQueryOutputItem,
} from 'src/query/roll-breakdown.query'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'
import { utils, WorkSheet, write } from 'xlsx'

const { IT_SIU, DI_KI, SAM_HONG, SI_CHIN, TWI_THENG, CHIONG_GUAN } = PrizeTier
const RANK_DISPLAY_SEQUENCE = [
  IT_SIU,
  DI_KI,
  SAM_HONG,
  SI_CHIN,
  TWI_THENG,
  CHIONG_GUAN,
]

interface SheetRow {
  username: string
  deleted: 'Y' | null
  roll: string
  timestamp: string
  wonPrize: 'Y' | null
  rank: string
}

type SheetHeaders = Array<keyof SheetRow>

@Injectable()
export class AdvancedHistoryExporterService {
  constructor(private client: Client) {}

  private async getGuildMemberName(
    guildId: string,
    userId: string
  ): Promise<string> {
    const { client } = this
    const guild = await client.guilds.fetch(guildId)
    if (!guild) {
      return null
    }

    const member = await guild.members.fetch(userId)
    return member.nickname ?? member.user.username
  }

  private async getSheetRow({
    rollOwner,
    guildId,
    deleted,
    roll,
    timestamp,
    excludeFromPrize,
    rank,
  }: RollBreakdownQueryOutputItem): Promise<SheetRow> {
    return {
      wonPrize: excludeFromPrize ? null : 'Y',
      rank: PrizeTierLabels[rank],
      username: await this.getGuildMemberName(guildId, rollOwner),
      deleted: deleted ? 'Y' : null,
      roll: roll.join('-'),
      timestamp: DateTime.fromJSDate(timestamp)
        .setZone('Asia/Manila')
        .toFormat('yyyy/mm/dd HH:mm:ss'),
    }
  }

  private async convertBreakdownToRows(rolls: RollBreakdownQueryOutputItem[]) {
    const rows: SheetRow[] = []

    for (const roll of rolls) {
      rows.push(await this.getSheetRow(roll))
    }

    return rows
  }

  private async generateHistorySheet(
    rolls: RollBreakdownQueryOutputItem[]
  ): Promise<WorkSheet> {
    const data = await this.convertBreakdownToRows(rolls)

    const headers: SheetHeaders = [
      'timestamp',
      'roll',
      'username',
      'rank',
      'deleted',
      'wonPrize',
    ]

    return utils.json_to_sheet(data, {
      header: headers,
    })
  }

  private async generateTierSheet(
    rolls: RollBreakdownQueryOutputItem[]
  ): Promise<WorkSheet> {
    const data = await this.convertBreakdownToRows(rolls)

    const headers: SheetHeaders = [
      'timestamp',
      'roll',
      'username',
      'deleted',
      'wonPrize',
    ]

    return utils.json_to_sheet(data, {
      header: headers,
    })
  }

  async generateWorkBook(
    { all, ...ranks }: RollBreakdownQueryOutput,
    limits: PrizeLimits
  ): Promise<Buffer> {
    const workBook = utils.book_new()
    utils.book_append_sheet(
      workBook,
      await this.generateHistorySheet(all || []),
      'History'
    )

    for (const tierCode of RANK_DISPLAY_SEQUENCE) {
      const sheetName =
        limits[tierCode] === -1
          ? PrizeTierLabels[tierCode]
          : `${PrizeTierLabels[tierCode]} (limited to ${limits[tierCode]})`
      utils.book_append_sheet(
        workBook,
        await this.generateTierSheet(ranks[tierCode] || []),
        sheetName
      )
    }

    return write(workBook, {
      type: 'buffer',
    }) as Buffer
  }
}
