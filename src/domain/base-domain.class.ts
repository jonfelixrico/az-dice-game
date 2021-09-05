import { IEvent } from '@nestjs/cqrs'

export class BaseDomain {
  events: IEvent[]

  apply(event: IEvent) {
    this.events.push(event)
  }
}
