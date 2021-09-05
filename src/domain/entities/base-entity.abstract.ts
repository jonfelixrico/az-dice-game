import { BaseDomainEvent } from '../events/base-domain-event.interface'

export interface IBaseDomain {
  revision: bigint
}

export abstract class BaseDomain implements IBaseDomain {
  events: BaseDomainEvent[]

  abstract revision: bigint

  apply(event: BaseDomainEvent) {
    this.events.push(event)
  }
}
