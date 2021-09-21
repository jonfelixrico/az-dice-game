import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GuildMember } from 'discord.js'
import { DateTime } from 'luxon'
import { ChannelRoll } from 'src/query/commons.interfaces'
import { PrizeTierLabels } from 'src/utils/prize-eval'
import { DiscordHelperService } from './../discord-helper/discord-helper.service'

export interface FormattedRoll {
  timestamp: string
  roll: string
  user: GuildMember
  rank: string
}

const DEFAULT_FACE_MAPPING = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']

@Injectable()
export class RollFormatterService {
  private _cached: Record<number, string>

  constructor(
    private cfg: ConfigService,
    private helper: DiscordHelperService
  ) {}

  private get rollface(): Record<number, unknown> {
    if (this._cached) {
      return this._cached
    }

    const fromCfg = this.cfg.get<string>('FACE_MAPPING') ?? ''
    const sliced = fromCfg.split(',').map((str) => str.trim())

    const mappingToUse = sliced.length === 6 ? sliced : DEFAULT_FACE_MAPPING
    const asMap = mappingToUse.reduce((map, value, index) => {
      map[index + 1] = value
      return map
    }, {})

    return (this._cached = asMap)
  }

  serializeRoll(roll: number[]): string {
    const { rollface } = this
    return roll.map((numericFace) => rollface[numericFace]).join(' ')
  }

  async formatRoll({
    guildId,
    rollOwner,
    roll,
    timestamp,
    rank,
  }: ChannelRoll): Promise<FormattedRoll> {
    const dateTime = DateTime.fromJSDate(timestamp)

    return {
      roll: this.serializeRoll(roll),
      timestamp: dateTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS),
      user: await this.helper.getGuildMember(guildId, rollOwner),
      rank: rank ? PrizeTierLabels[rank] : null,
    }
  }
}
