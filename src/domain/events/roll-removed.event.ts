import {
  BaseDomainEvent,
  BaseEventPayload,
} from './base-domain-event.interface'

export interface IRollRemovedEventPayload extends BaseEventPayload {
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
