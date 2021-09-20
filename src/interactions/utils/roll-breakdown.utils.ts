import { MessageEmbedOptions } from 'discord.js'
import { chain } from 'lodash'
import {
  PrizeLimits,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'

const { IT_SIU, DI_KI, SAM_HONG, SI_CHIN, TWI_THENG, CHIONG_GUAN } = PrizeTier
const RANK_DISPLAY_SEQUENCE = [
  CHIONG_GUAN,
  TWI_THENG,
  SI_CHIN,
  SAM_HONG,
  DI_KI,
  IT_SIU,
]

export function rollBreakdownEmbedFormatter(
  breakdown: RollBreakdownQueryOutput,
  prizeLimits: PrizeLimits
): MessageEmbedOptions {
  const { all, ...ranked } = breakdown

  const rankEntries = RANK_DISPLAY_SEQUENCE.map((rank) => {
    const rankedEntry = ranked[rank] ?? []

    const included = rankedEntry.filter(
      ({ excludeFromPrize }) => !excludeFromPrize
    )

    return {
      label: PrizeTierLabels[rank],
      included: included,
      excludedCount: rankedEntry.length - included.length,
      limit: prizeLimits[rank],
    }
  }).map(({ label, included, excludedCount, limit }) => {
    const header = `**${label}**`
    const subheader = `Limited to **${limit}**; with **${included.length}** matching and **${excludedCount}** dropped`
    const userCount = chain(included)
      .map(({ rollOwner }) => rollOwner)
      .countBy()
      .toPairs()
      .orderBy(([key]) => key)
      .map(([userId, count]) => `<@${userId}> (**${count}**)`)
      .value()

    return [header, subheader, ...userCount, ''].join('\n')
  })

  const duds = all.filter(({ rank }) => !rank)

  return {
    author: {
      name: 'Roll Breakdown',
    },

    description: [
      ...rankEntries,
      `**No prize** - ${duds.length}`,
      '',
      all.length !== 1
        ? `There are **${all.length}** rolls made so far.`
        : 'There is **1** roll made so far.',
    ].join('\n'),

    footer: {
      text: `limits: ${serializePrizeLimits(prizeLimits)}`,
    },
  }
}

export function serializePrizeLimits(limits: PrizeLimits): string {
  return [
    limits[IT_SIU],
    limits[DI_KI],
    limits[SAM_HONG],
    limits[SI_CHIN],
    limits[TWI_THENG],
    limits[CHIONG_GUAN],
  ].join(',')
}

export const PRIZE_LIMITS_REGEXP = /^\d+(?:,\d+){5}$/

export function parsePrizeLimits(str: string): PrizeLimits | null {
  if (!PRIZE_LIMITS_REGEXP.test(str)) {
    return null
  }

  return chain(str)
    .split(',')
    .map((val, idx) => [idx + 1, parseInt(val)] as [number, number])
    .fromPairs()
    .value() as PrizeLimits
}
