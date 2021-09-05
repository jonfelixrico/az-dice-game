import { IEvent } from '@nestjs/cqrs'
import { DomainEvents } from './domain-events.enum'

export interface IBaseEvent<PayloadType = any> extends IEvent {
  entityId: string
  eventName: DomainEvents | keyof typeof DomainEvents
  payload: PayloadType
}
