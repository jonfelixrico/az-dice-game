import { IRoll } from '../entities/user-roll.interface'
import { BaseDomainEvent } from './base-domain-event.interface'

export interface IRollCreatedEventPayload extends IRoll {
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
