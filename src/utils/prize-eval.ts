import { chain, sumBy } from 'lodash'

export enum PrizeTier {
  CHIONG_GUAN = 6,
  TWI_THENG = 5,
  SI_CHIN = 4,
  SAM_HONG = 3,
  DI_KI = 2,
  IT_SIU = 1,
}

const { CHIONG_GUAN, TWI_THENG, SI_CHIN, SAM_HONG, DI_KI, IT_SIU } = PrizeTier

export const PrizeTierLabels: Record<PrizeTier, string> = {
  [CHIONG_GUAN]: 'Chiong Guan',
  [TWI_THENG]: 'Twi Theng',
  [SI_CHIN]: 'Si Chin',
  [SAM_HONG]: 'Sam Hong',
  [DI_KI]: 'Di Ki',
  [IT_SIU]: 'It Siu',
}

type Histogram = {
  face: number
  count: number
}[]

interface PrizeTierEvaluator {
  tier: PrizeTier
  evaluator: (faceHistogram: Histogram) => number | null
  points: number
}

const EVALUATORS: PrizeTierEvaluator[] = [
  {
    // six of a kind
    tier: CHIONG_GUAN,
    points: 100000,
    evaluator(histogram) {
      const sixOfAKind = histogram.find(({ count }) => count === 6)
      return sixOfAKind?.face || null
    },
  },
  {
    // five of a kind
    tier: CHIONG_GUAN,
    points: 90000,
    evaluator(histogram) {
      // check if a face is rolled five times
      const fiveOfAKind = histogram.find(({ count }) => count === 5)
      if (!fiveOfAKind) {
        return null
      }

      const kicker = histogram.find(({ count }) => count === 1)
      return (
        fiveOfAKind.face * 10 + // we do x10 to separate the 5-of-a-kind faces from each other
        kicker.face // and we use the kicker's value as the tiebreaker if other rolls also had 5-of-a-kind
      )
    },
  },
  {
    // four 4s
    tier: CHIONG_GUAN,
    points: 80000,
    evaluator(histogram) {
      // check if four dice faces are fours
      const hasFourFours = histogram.some(
        ({ face, count }) => face === 4 && count === 4
      )

      if (!hasFourFours) {
        return null
      }

      // the remaining dice (face is not 4) will be summed up
      return sumBy(
        histogram.filter(({ face }) => face !== 4),
        ({ face }) => face
      )
    },
  },
  {
    // 2x three of a kind
    tier: TWI_THENG,
    points: 500,
    evaluator(histogram) {
      if (histogram.every(({ count }) => count === 3)) {
        return 0
      }

      return null
    },
  },
  {
    // one of each  (1, 2, 3, 4, 5, 6)
    tier: TWI_THENG,
    points: 500,
    evaluator(histogram) {
      if (histogram.length === 6) {
        return 0
      }

      return null
    },
  },
  {
    // four of a kind, except for 4s
    tier: SI_CHIN,
    points: 400,
    evaluator(histogram) {
      // check if there are four of a kind
      const hasFourOfAKind = histogram.some(({ count }) => count === 4)

      if (hasFourOfAKind) {
        return 0
      }

      return null
    },
  },
  {
    // three 4s
    tier: SAM_HONG,
    points: 300,
    evaluator(histogram) {
      if (histogram.some(({ count, face }) => count === 3 && face === 4)) {
        return 0
      }

      return null
    },
  },
  {
    // two 4s
    tier: DI_KI,
    points: 200,
    evaluator(histogram) {
      if (histogram.some(({ count, face }) => count === 2 && face === 4)) {
        return 0
      }

      return null
    },
  },
  {
    // one 4
    tier: IT_SIU,
    points: 100,
    evaluator(histogram) {
      if (histogram.some(({ count, face }) => count === 1 && face === 4)) {
        return 0
      }

      return null
    },
  },
]

function getHistogram(diceFaces: number[]): Histogram {
  return (
    chain(diceFaces)
      /*
       * Creates an object. Each object has a key of the dice face and a value
       * of how many entries within `diceFaces` matches it
       */
      .countBy()
      .toPairs()
      .map(([faceString, count]) => {
        return {
          face: parseInt(faceString),
          count,
        }
      })
      .value()
  )
}

interface RollEvaluation {
  tier: PrizeTier
  points: number
}

export function evaluateRoll(diceFaces: number[]): RollEvaluation {
  const histogram = getHistogram(diceFaces)

  for (const { evaluator, points, tier } of EVALUATORS) {
    const evaluatorResults = evaluator(histogram)
    if (evaluatorResults === null) {
      continue
    }

    return {
      tier,
      points: points + evaluatorResults,
    }
  }

  return null
}
