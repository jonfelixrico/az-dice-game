export interface PrizeTierCombination {
  roll: string[]
}

export interface PrizeTier {
  name: string
  rank: number
  subrank?: number
  combinations: PrizeTierCombination[]
}

export const PRIZE_TIERS: PrizeTier[] = [
  {
    name: 'Chiong Guan (Tier 3)',
    rank: 6,
    subrank: 3,
    combinations: [
      {
        roll: ['4', '4', '4', '4', '4', '4'],
      },
      {
        roll: ['6', '6', '6', '6', '6', '6'],
      },
      {
        roll: ['5', '5', '5', '5', '5', '5'],
      },
      {
        roll: ['3', '3', '3', '3', '3', '3'],
      },
      {
        roll: ['2', '2', '2', '2', '2', '2'],
      },
      {
        roll: ['1', '1', '1', '1', '1', '1'],
      },
    ],
  },
  {
    name: 'Chiong Guan (Tier 2)',
    rank: 6,
    subrank: 2,
    combinations: [
      {
        roll: ['6', '6', '6', '6', '6', '*'],
      },
      {
        roll: ['5', '5', '5', '5', '5', '*'],
      },
      {
        roll: ['3', '3', '3', '3', '3', '*'],
      },
      {
        roll: ['2', '2', '2', '2', '2', '*'],
      },
      {
        roll: ['1', '1', '1', '1', '1', '*'],
      },
    ],
  },
  {
    name: 'Chiong Guan (Tier 1)',
    rank: 6,
    subrank: 1,
    combinations: [
      {
        roll: ['4', '4', '4', '4', '*', '*'],
      },
    ],
  },
  {
    name: 'Twi Theng',
    rank: 5,
    combinations: [
      {
        roll: ['x', 'x', 'x', 'y', 'y', 'y'],
      },
      {
        roll: ['1', '2', '3', '4', '5', '6'],
      },
    ],
  },
  {
    name: 'Si Chin',
    rank: 4,
    combinations: [
      {
        roll: ['x', 'x', 'x', 'x', '*', '*'],
      },
    ],
  },
  {
    name: 'Sam Hong',
    rank: 3,
    combinations: [
      {
        roll: ['4', '4', '4', '*', '*', '*'],
      },
    ],
  },
  {
    name: 'Di Ki',
    rank: 2,
    combinations: [
      {
        roll: ['4', '4', '*', '*', '*', '*'],
      },
    ],
  },
  {
    name: 'It Siu',
    rank: 1,
    combinations: [
      {
        roll: ['4', '*', '*', '*', '*', '*'],
      },
    ],
  },
]
