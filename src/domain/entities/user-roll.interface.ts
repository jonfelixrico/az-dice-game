export type DiceRoll = [number, number, number, number, number, number]

enum RollType {
  NATURAL = 'NATURAL',
  NATURAL_OVERRIDE = 'NATURAL_OVERRIDE',
  PROXY = 'PROXY',
  MANUAL = 'MANUAL',
}

export interface IRoll {
  rollOwner: string
  rollExecutor: string
  roll: DiceRoll
  timestamp: Date
  type: keyof typeof RollType
  rollId: string
}
