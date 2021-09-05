export type DiceRoll = [number, number, number, number, number, number]

enum RollType {
  NATURAL = 'NATURAL',
  NATURAL_OVERRIDE = 'NATURAL_OVERRIDE',
  PROXY = 'PROXY',
  MANUAL = 'MANUAL',
}

export interface IUserRoll {
  userId: string
  roll: DiceRoll
  timestamp: Date
  type: keyof typeof RollType
}
