import { BaseDomainEvent } from './base-domain-event.interface'

export interface ISessionRollIdUpdatedEventPayload {
  channelId: string
  guildId: string
  rollId: string
  timestamp: Date
}

export class SessionRollIdUpdatedEvent extends BaseDomainEvent<ISessionRollIdUpdatedEventPayload> {
  constructor(payload: ISessionRollIdUpdatedEventPayload) {
    const { channelId, guildId } = payload

    super({
      entityId: [guildId, channelId].join('/'),
      eventName: 'SESSION_ROLL_ID_UPDATED',
      payload,
    })
  }
}
