import { EventTypes } from './event-types.enum'

export interface IBaseEventPayload extends Record<string, unknown> {
  channelId: string
  timestamp: Date
  guildId: string
}

export interface IBaseEvent<
  Payload extends IBaseEventPayload = IBaseEventPayload
> {
  type: keyof typeof EventTypes
  payload: Payload
}
