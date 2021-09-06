import { IBaseEvent, IBaseEventPayload } from './base-event.interface'

export interface IRollCreatedEventPayload extends IBaseEventPayload {
  userId: string
  channelId: string
  rollId: string
}

export interface IRollCreatedEvent
  extends IBaseEvent<IRollCreatedEventPayload> {
  type: 'CHANNEL_SESSION_ROLL_ID_SET'
}
