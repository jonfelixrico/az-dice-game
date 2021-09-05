import { BaseDomainEvent } from './base-domain-event.interface'

export interface IRollRemovedEventPayload {
  rollId: string
  guildId: string
  channelId: string
  timestamp: Date
}

export class RollRemovedEvent extends BaseDomainEvent<IRollRemovedEventPayload> {
  constructor(payload: IRollRemovedEventPayload) {
    const { channelId, guildId } = payload

    super({
      entityId: [guildId, channelId].join('/'),
      eventName: 'ROLL_REMOVED',
      payload,
    })
  }
}
