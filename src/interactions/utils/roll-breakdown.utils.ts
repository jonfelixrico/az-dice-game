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
      droppedCount:
        rankedEntry.filter(({ deleted }) => !deleted).length - included.length,
      limit: prizeLimits[rank],
    }
  }).map(({ label, included, droppedCount, limit }) => {
    let header = `**${label}**`
    if (limit !== -1) {
      header = `${header} - limited to **${limit}**`
    }

    const matchingRollsText =
      included.length === 1
        ? '**1** matching roll'
        : `**${included.length}** matching rolls`

    let subheader = matchingRollsText
    if (limit !== -1 && droppedCount > 0) {
      subheader = `${matchingRollsText}, **${droppedCount}** not included due to limit`
    }

    const userCount = chain(included)
      .map(({ rollOwner }) => rollOwner)
      .countBy()
      .toPairs()
      .orderBy(([key]) => key)
      .map(([userId, count]) => {
        const userStr = `<@${userId}>`
        if (count === 1) {
          return `> ${userStr}`
        }

        return `> ${userStr} (**${count}** times)`
      })
      .value()

    return [header, subheader, ...userCount, ''].join('\n')
  })

  const notDeleted = all.filter(({ deleted }) => !deleted)
  const duds = notDeleted.filter(({ rank }) => !rank)

  const noMatchText = [
    '**No match**',
    duds.length === 1 ? '**1** roll' : `**${duds.length}** rolls`,
    '',
  ].join('\n')

  return {
    author: {
      name: 'Roll Breakdown',
    },

    description: [
      ...rankEntries,
      noMatchText,
      notDeleted.length !== 1
        ? `There are **${notDeleted.length}** rolls made so far.`
        : 'There is **1** roll made so far.',
    ].join('\n'),
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
