import { Injectable, Logger } from '@nestjs/common'
import { chain, random, range, truncate } from 'lodash'
import { sprintf } from 'sprintf-js'
import quipsJson = require('./quips.json')
import { PrizeTier } from 'src/utils/prize-eval'

interface QuipEntry {
  text?: string
  image?: string
  prizeTiers?: number[]
}

export type Quip = Omit<QuipEntry, 'prizeTiers'>

const ALL_TIERS = range(1, 7) // generate numbers 1-6

const GROUPED_QUIPS = chain(quipsJson as QuipEntry[])
  .map((entry) => {
    const { prizeTiers } = entry
    const tierArray = prizeTiers && prizeTiers.length ? prizeTiers : ALL_TIERS

    return tierArray.map((tier) => {
      return {
        entry,
        tier,
      }
    })
  })
  .flatten()
  .groupBy('tier')
  .mapValues((items) => items.map((item) => item.entry))
  .value()

@Injectable()
export class QuipGeneratorService {
  constructor(private logger: Logger) {}

  getQuipForRank(rank: PrizeTier | null): Quip {
    rank = rank ?? 0
    const { logger } = this

    const quipGroup = GROUPED_QUIPS[rank]

    if (!quipGroup || !quipGroup.length) {
      logger.debug(
        sprintf("Can't find any quips for rank %d", rank),
        QuipGeneratorService.name
      )
      return
    }

    const index = random(0, quipGroup.length - 1)
    const quip = quipGroup[index]

    logger.debug(
      sprintf(
        'Using quip with text "%s" and image "%s" for rank %d',
        truncate(quip.text, { length: 25 }),
        truncate(quip.image, { length: 25 }),
        rank
      ),
      QuipGeneratorService.name
    )

    return quip
  }
}
