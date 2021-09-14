import { PrizeTier, PrizeTierCombination, PRIZE_TIERS } from './prize-tier'

export interface MatchingCombo extends Omit<PrizeTier, 'combinations'> {
  combination: PrizeTierCombination
}

/**
 * Evaluates the dice roll if it falls under the dice combination.
 *
 * @param roll        a 6-number array representing each dice result.
 * @param combination a 6-string array representing each dice result. Valid characters
 *                              are numbers 1 - 6, "*" for wildcard, and "x" & "y" for matching numbers.
 * @returns true if the roll falls under the combination, false otherwise.
 */
function doesRollMatchCombination(roll: number[], combination: string[]) {
  // combination is expecting [1-6]s then [x]s then [y]s then [*]s.

  if (roll === null) {
    return false
  }

  const rollBucket = [0, 0, 0, 0, 0, 0, 0]
  roll.forEach((item) => rollBucket[item]++)

  let xToMatch = 0
  let yToMatch = 0

  // clear out defined numbers first
  for (let i = 0; i < combination.length; i++) {
    const match = combination[i]
    const parsedMatch = parseInt(match)

    if (!isNaN(parsedMatch)) {
      if (--rollBucket[parsedMatch] < 0) {
        return false
      }
    } else if (match == 'x') {
      xToMatch++
    } else if (match == 'y') {
      yToMatch++
    }
  }

  if (xToMatch == 0 && yToMatch == 0) {
    return true
  } else if (xToMatch == 0 && yToMatch > 0) {
    // to simplify, just pass "y"s to "x"s
    xToMatch = yToMatch
    yToMatch = 0
  }

  for (let i = 1; i < rollBucket.length; i++) {
    if (yToMatch > 0) {
      for (let j = i + 1; j < rollBucket.length; j++) {
        if (
          (rollBucket[i] >= xToMatch && rollBucket[j] >= yToMatch) ||
          (rollBucket[i] >= yToMatch && rollBucket[j] >= xToMatch)
        ) {
          return true
        }
      }
    } else if (rollBucket[i] >= xToMatch) {
      return true
    }
  }

  return false
}

/**
 * Evaluates the dice roll and returns the prize tier that it falls in.
 *
 * @param {Array} roll a 6-number array representing each dice result.
 * @returns The prize tier, or null if it does not fall under any.
 */
export function evaluateRoll(roll: number[]): MatchingCombo | null {
  for (const { combinations, ...others } of PRIZE_TIERS) {
    for (const combo of combinations) {
      if (doesRollMatchCombination(roll, combo.roll)) {
        return {
          ...others,
          combination: combo,
        }
      }
    }
  }

  return null
}

export function getPrizeTier(rank: number, subrank?: number) {
  return PRIZE_TIERS.find(
    (tier) => rank === tier.rank && (subrank ?? null) === (tier.subrank ?? null)
  )
}
