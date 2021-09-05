import { IEvent } from '@nestjs/cqrs'
import { DomainEvents } from './domain-events.enum'

type EventName = DomainEvents | keyof typeof DomainEvents

interface IDomainEvent<PayloadType = any> {
  readonly entityId: string
  readonly eventName: EventName
  readonly payload: PayloadType
}

export class BaseDomainEvent<PayloadType = any>
  implements IEvent, IDomainEvent<PayloadType>
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
