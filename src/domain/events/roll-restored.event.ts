import { BaseDomainEvent } from './base-domain-event.interface'

export interface IRollRestoredEventPayload {
  rollId: string
  guildId: string
  channelId: string
  timestamp: string
}

export class RollRestoredEvent extends BaseDomainEvent<IRollRestoredEventPayload> {
  constructor(payload: IRollRestoredEventPayload) {
    const { channelId, guildId } = payload

    super({
      entityId: [guildId, channelId].join('/'),
      eventName: 'ROLL_RESTORED',
      payload,
    })
  }
}
