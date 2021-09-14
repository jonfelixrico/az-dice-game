import { IEvent } from '@nestjs/cqrs'
import {
  IBaseEvent,
  IBaseEventPayload,
} from 'src/write-model/types/base-event.interface'

/**
 * Represents a time where we the read model has consumed an event that we also published by the same app instance.
 */
export class ReadModelSyncedEvent<E extends IBaseEvent = IBaseEvent>
  implements IEvent, IBaseEvent
{
  constructor({ type, payload }: E) {
    this.type = type
    this.payload = payload
  }

  type:
    | 'ROLL_CREATED'
    | 'ROLL_REMOVED'
    | 'ROLL_RESTORED'
    | 'CHANNEL_SESSION_ROLL_ID_SET'
  payload: IBaseEventPayload
}
