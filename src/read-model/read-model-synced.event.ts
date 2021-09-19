import { AllStreamRecordedEvent } from '@eventstore/db-client'
import { IEvent } from '@nestjs/cqrs'
import { IBaseEvent } from 'src/write-model/types/base-event.interface'

/**
 * Represents a time where we the read model has consumed an event that we also published by the same app instance.
 */
export class ReadModelSyncedEvent<E extends IBaseEvent = IBaseEvent>
  implements IEvent
{
  constructor(
    readonly domainEvent: E,
    readonly esdbEvent: AllStreamRecordedEvent
  ) {}
}
