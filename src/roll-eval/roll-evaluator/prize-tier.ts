export interface PrizeTier {
  name: string
  rank: number
  subrank?: number
  desc: string
  combination: {
    tier?: number
    roll: string[]
  }[]
}

export const PRIZE_TIERS: PrizeTier[] = [
  {
    name: 'Chiong Guan (Tier 3)',
    rank: 6,
    subrank: 3,
    desc: '6 same numbers',
    combination: [
      {
        tier: 6,
        roll: ['4', '4', '4', '4', '4', '4'],
      },
      {
        tier: 5,
        roll: ['6', '6', '6', '6', '6', '6'],
      },
      {
        tier: 4,
        roll: ['5', '5', '5', '5', '5', '5'],
      },
      {
        tier: 3,
        roll: ['3', '3', '3', '3', '3', '3'],
      },
      {
        tier: 2,
        roll: ['2', '2', '2', '2', '2', '2'],
      },
      {
        tier: 1,
        roll: ['1', '1', '1', '1', '1', '1'],
      },
    ],
  },
  {
    name: 'Chiong Guan (Tier 2)',
    rank: 6,
    subrank: 2,
    desc: '5 same numbers',
    combination: [
      {
        tier: 5,
        roll: ['6', '6', '6', '6', '6', '*'],
      },
      {
        tier: 4,
        roll: ['5', '5', '5', '5', '5', '*'],
      },
      {
        tier: 3,
        roll: ['3', '3', '3', '3', '3', '*'],
      },
      {
        tier: 2,
        roll: ['2', '2', '2', '2', '2', '*'],
      },
      {
        tier: 1,
        roll: ['1', '1', '1', '1', '1', '*'],
      },
    ],
  },
  {
    name: 'Chiong Guan (Tier 1)',
    rank: 6,
    subrank: 1,
    desc: 'Four 4s',
    combination: [
      {
        roll: ['4', '4', '4', '4', '*', '*'],
      },
    ],
  },
  {
    name: 'Twi Theng',
    rank: 5,
    desc: 'Numbers from 1 to 6',
    combination: [
      {
        roll: ['1', '2', '3', '4', '5', '6'],
      },
    ],
  },
  {
    name: 'Twi Theng',
    rank: 5,
    desc: '2 groups of the same number',
    combination: [
      {
        roll: ['x', 'x', 'x', 'y', 'y', 'y'],
      },
    ],
  },
  {
    name: 'Si Chin',
    rank: 4,
    desc: '4 same numbers except 4',
    combination: [
      {
        roll: ['x', 'x', 'x', 'x', '*', '*'],
      },
    ],
  },
  {
    name: 'Sam Hong',
    rank: 3,
    desc: 'Three 4s',
    combination: [
      {
        roll: ['4', '4', '4', '*', '*', '*'],
      },
    ],
  },
  {
    name: 'Di Ki',
    rank: 2,
    desc: 'Two 4s',
    combination: [
      {
        roll: ['4', '4', '*', '*', '*', '*'],
      },
    ],
  },
  {
    name: 'It Siu',
    rank: 1,
    desc: 'One 4',
    combination: [
      {
        roll: ['4', '*', '*', '*', '*', '*'],
      },
    ],
  },
]
