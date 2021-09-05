import {
  BaseDomainEvent,
  BaseEventPayload,
} from './base-domain-event.interface'

export interface IRollRestoredEventPayload extends BaseEventPayload {
  rollId: string
  guildId: string
  channelId: string
  timestamp: Date
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
