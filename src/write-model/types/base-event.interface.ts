import { EventTypes } from './event-types.enum'

export interface IBaseEvent<
  Payload extends Record<string, unknown> = Record<string, unknown>
> {
  type: keyof typeof EventTypes
  payload: Payload
}
