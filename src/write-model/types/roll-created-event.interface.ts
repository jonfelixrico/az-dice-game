import { IBaseEvent, IBaseEventPayload } from './base-event.interface'

export enum IRollTypes {
  NATURAL = 'NATURAL',
  NATURAL_FORCED_TURN = 'NATURAL_FORCED_TURN',
  MANUAL = 'MANUAL',
  PROXY = 'PROXY',
}

export interface IRollCreatedEventPayload extends IBaseEventPayload {
  rollId: string
  roll: number[]

  type: keyof typeof IRollTypes | IRollTypes
  rollDt: Date

  rolledBy: string
  rollOwner: string

  channelId: string
  guildId: string
}

export interface IRollCreatedEvent
  extends IBaseEvent<IRollCreatedEventPayload> {
  type: 'ROLL_CREATED'
}
