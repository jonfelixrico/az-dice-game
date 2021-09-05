import { BaseDomainEvent } from './base-domain-event.interface'

export interface IRollRemovedEventPayload {
  rollId: string
  guildId: string
  channelId: string
  timestamp: string
}

export class RollRemovedEvent extends BaseDomainEvent<IRollRemovedEventPayload> {
  constructor(payload) {
    const { channelId, guildId } = payload

    super({
      entityId: [guildId, channelId].join('/'),
      eventName: 'ROLL_REMOVED',
      payload,
    })
  }
}
