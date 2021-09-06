import { IBaseEvent } from './base-event.interface'

export interface IRollRestoredEventPayload extends Record<string, unknown> {
  rollId: string
  channelId: string
  guildId: string
  userId: string
}

export interface IRollRestoredEvent
  extends IBaseEvent<IRollRestoredEventPayload> {
  type: 'ROLL_REMOVED'
}
