import { IBaseEvent } from '../events/base-event.interface'

export class BaseDomain {
  events: IBaseEvent[]

  apply(event: IBaseEvent) {
    this.events.push(event)
  }
}
