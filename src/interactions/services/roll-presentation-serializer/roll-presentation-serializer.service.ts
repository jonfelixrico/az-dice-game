import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

const DEFAULT_FACE_MAPPING = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']

@Injectable()
/**
 * @deprectad
 */
export class RollPresentationSerializerService {
  private _cached: Record<number, string>

  constructor(private cfg: ConfigService) {}

  private get rollface(): Record<number, unknown> {
    if (this._cached) {
      return this._cached
    }

    const fromCfg = this.cfg.get<string>('FACE_MAPPING') ?? ''
    const sliced = fromCfg.split(',').map((str) => str.trim())

    const mappingToUse = sliced.length === 6 ? sliced : DEFAULT_FACE_MAPPING
    const asMap = mappingToUse.reduce((map, value, index) => {
      map[index + 1] = value
      return map
    }, {})

    return (this._cached = asMap)
  }

  serializeRoll(roll: number[]): string {
    const { rollface } = this
    return roll.map((numericFace) => rollface[numericFace]).join(' ')
  }
}
