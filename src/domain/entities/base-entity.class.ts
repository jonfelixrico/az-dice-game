import { BaseDomainEvent } from '../events/base-domain-event.interface'

export class BaseDomain {
  events: BaseDomainEvent[]

  apply(event: BaseDomainEvent) {
    this.events.push(event)
  }
}
