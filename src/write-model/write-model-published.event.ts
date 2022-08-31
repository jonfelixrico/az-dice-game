import { IEvent } from '@nestjs/cqrs'
import { IBaseEvent } from './types/base-event.interface'

export interface WriteModelPublishedEventPayload<
  E extends IBaseEvent = IBaseEvent
> {
  event: E
  /**
   * This is the event uuid generated by ESDB.
   */
  eventId: string
}

/**
 * Represents an event where this instance of the app has published an event to ESDB.
 */
export class WriteModelPublishedEvent<E extends IBaseEvent = IBaseEvent>
  implements IEvent
{
  constructor(readonly payload: WriteModelPublishedEventPayload<E>) {}
}
