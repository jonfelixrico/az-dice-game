import { EventTypes } from './event-types.enum'

export interface IBaseEventPayload extends Record<string, unknown> {
  guildId: string
  channelId: string
  rollId: string
  timestamp: Date
}

export interface IBaseEvent<
  Payload extends IBaseEventPayload = IBaseEventPayload
> {
  type: keyof typeof EventTypes
  payload: Payload
}
