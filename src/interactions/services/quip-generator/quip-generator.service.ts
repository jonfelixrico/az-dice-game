import { Injectable } from '@nestjs/common'
import { chain, random, range } from 'lodash'
import quips from 'src/../quips.json'
import { PrizeTier } from 'src/utils/prize-eval'

interface QuipEntry {
  text?: string
  image?: string
  prizeTiers?: number[]
}

export type Quip = Omit<QuipEntry, 'prizeTiers'>

const ALL_TIERS = range(1, 7) // generate numbers 1-6

const GROUPED_QUIPS = chain(quips as QuipEntry[])
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
  getQuipForRank(rank: PrizeTier | null): QuipEntry {
    rank = rank ?? 0

    const quipGroup = GROUPED_QUIPS[rank]

    if (!quipGroup || !quipGroup.length) {
      return
    }

    const index = random(0, quipGroup.length - 1)
    return quipGroup[index]
  }
}
