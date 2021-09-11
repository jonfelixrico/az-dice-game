import { IBaseEvent, IBaseEventPayload } from './base-event.interface'

export type RollType = 'NATURAL' | 'NATURAL_FORCED_TURN' | 'MANUAL' | 'PROXY'

export interface IRollCreatedEventPayload extends IBaseEventPayload {
  rollId: string
  roll: number[]

  type: RollType

  rolledBy: string
  rollOwner: string

  channelId: string
  guildId: string
}

export interface IRollCreatedEvent
  extends IBaseEvent<IRollCreatedEventPayload> {
  type: 'ROLL_CREATED'
}
