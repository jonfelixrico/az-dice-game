import { IEvent } from '@nestjs/cqrs'
import { DomainEvents } from './domain-events.enum'

export type EventName = DomainEvents | keyof typeof DomainEvents

export type BaseEventPayload = Record<string, unknown>

interface IDomainEvent<
  PayloadType extends BaseEventPayload = BaseEventPayload
> {
  readonly entityId: string
  readonly eventName: EventName
  readonly payload: PayloadType
}

export class BaseDomainEvent<
  PayloadType extends BaseEventPayload = BaseEventPayload
> implements IEvent, IDomainEvent<PayloadType>
{
  readonly entityId: string
  readonly eventName: EventName
  readonly payload: PayloadType

  constructor({ entityId, eventName, payload }: IDomainEvent<PayloadType>) {
    this.entityId = entityId
    this.eventName = eventName
    this.payload = payload
  }
}
