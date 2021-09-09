import { random } from 'lodash'
import { nanoid } from 'nanoid'

export function doRoll() {
  return new Array(6).fill(0).map(() => random(1, 6))
}

export function createRoll() {
  return {
    rollId: nanoid(),
    roll: doRoll(),
  }
}
