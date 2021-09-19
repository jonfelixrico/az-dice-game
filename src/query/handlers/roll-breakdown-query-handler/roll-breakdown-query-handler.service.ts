import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs'
import { chain } from 'lodash'
import {
  RollBreakdownQuery,
  RollBreakdownQueryInput,
  RollBreakdownQueryOutput,
  RollBreakdownQueryOutputItem,
} from 'src/query/roll-breakdown.query'
import {
  RollHistoryQuery,
  RollHistoryQueryOutput,
} from 'src/query/roll-history.query'
import { PrizeTier } from 'src/utils/prize-eval'

const { CHIONG_GUAN, DI_KI, IT_SIU, SAM_HONG, SI_CHIN, TWI_THENG } = PrizeTier

type PrizeLimits = RollBreakdownQueryInput['prizeLimits']

const DEFAULT_PRIZE_LIMITS: PrizeLimits = Object.freeze({
  [CHIONG_GUAN]: -1,
  [DI_KI]: -1,
  [IT_SIU]: -1,
  [SAM_HONG]: -1,
  [SI_CHIN]: -1,
  [TWI_THENG]: -1,
})

const PRIZES_WITH_NORMAL_HANDLING = Object.freeze([
  DI_KI,
  IT_SIU,
  SAM_HONG,
  SI_CHIN,
  TWI_THENG,
])

/**
 * Returns a set of strings of rolls. Rolls with their ids included here will
 * have their prizes flagged as "retained"
 * @param history
 * @param prizeLimits
 * @returns
 */
function getIncludedInLimits(
  history: RollHistoryQueryOutput,
  prizeLimits?: PrizeLimits
): Set<string> {
  prizeLimits = prizeLimits ?? DEFAULT_PRIZE_LIMITS

  // group all undeleted rolls into ranks, excluding non-winning rolls
  const grouped = chain(history)
    .filter(({ rank, deleted }) => !!rank && !deleted)
    .groupBy(({ rank }) => rank)
    .value()

  const included = new Set<string>()

  // we'll just get the first N rolls for each prize, with N being the limit
  for (const prize of PRIZES_WITH_NORMAL_HANDLING) {
    const prizeGroup = grouped[prize]
    const limit = prizeLimits[prize]

    const limitedArr = limit === -1 ? prizeGroup : prizeGroup.slice(0, limit)
    limitedArr.forEach(({ rollId }) => included.add(rollId))
  }

  /*
   * Chiong guan has a different criteria for limits as opposed to the first N rolls.
   * We have to sort them by points.
   */
  const cgGroup = grouped[CHIONG_GUAN]
  if (cgGroup) {
    const sorted = cgGroup
      .sort((a, b) => {
        const pointsDiff = a.points - b.points
        if (pointsDiff !== 0) {
          return pointsDiff
        }

        if (a.timestamp <= b.timestamp) {
          return 1
        }

        return -1
      })
      .reverse()

    const limit = prizeLimits[CHIONG_GUAN]

    const limitedArr = limit === -1 ? sorted : sorted.slice(0, limit)
    limitedArr.forEach(({ rollId }) => included.add(rollId))
  }

  return included
}

@QueryHandler(RollBreakdownQuery)
export class RollBreakdownQueryHandlerService
  implements IQueryHandler<RollBreakdownQuery>
{
  constructor(private queryBus: QueryBus) {}

  async execute({
    input,
  }: RollBreakdownQuery): Promise<RollBreakdownQueryOutput> {
    const { prizeLimits, ...others } = input

    const history: RollHistoryQueryOutput = await this.queryBus.execute(
      new RollHistoryQuery(others)
    )

    const included = getIncludedInLimits(history, prizeLimits)

    const transformed: RollBreakdownQueryOutputItem[] = history.map((roll) => {
      return {
        ...roll,
        excludeFromPrize: !included.has(roll.rollId),
      }
    })

    const regrouped = chain(transformed)
      .filter(({ rank, deleted }) => !!rank && !deleted)
      .groupBy(({ rank }) => rank)
      .value()

    return {
      ...regrouped,
      all: transformed,
    }
  }
}
