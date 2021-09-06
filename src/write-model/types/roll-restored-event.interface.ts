import { IBaseEvent, IBaseEventPayload } from './base-event.interface'

export interface IRollRestoredEventPayload extends IBaseEventPayload {
  rollId: string
  channelId: string
  guildId: string
  userId: string
}

export interface IRollRestoredEvent
  extends IBaseEvent<IRollRestoredEventPayload> {
  type: 'ROLL_REMOVED'
}
