import { IBaseEvent } from './base-event.interface'

export interface IRollRemovedEventPayload extends Record<string, unknown> {
  rollId: string
  channelId: string
  guildId: string
  userId: string
}

export interface IRollRemovedEvent
  extends IBaseEvent<IRollRemovedEventPayload> {
  type: 'ROLL_REMOVED'
}
