import { IRoll } from '../entities/user-roll.interface'
import {
  BaseDomainEvent,
  BaseEventPayload,
} from './base-domain-event.interface'

export interface IRollCreatedEventPayload extends IRoll, BaseEventPayload {
  channelId: string
  guildId: string
}

export class RollCreatedEvent extends BaseDomainEvent<IRollCreatedEventPayload> {
  constructor(payload: IRollCreatedEventPayload) {
    const { channelId, guildId } = payload

    super({
      entityId: [guildId, channelId].join('/'),
      eventName: 'ROLL_CREATED',
      payload,
    })
  }
}
