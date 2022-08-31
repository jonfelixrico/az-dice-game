import { AllStreamRecordedEvent } from '@eventstore/db-client'
import { IEvent } from '@nestjs/cqrs'

/**
 * Represents the event where the read model has successfully consumed an event from the ESDB stream.
 */
export class ReadModelConsumedEvent implements IEvent {
  constructor(readonly payload: AllStreamRecordedEvent) {}
}
