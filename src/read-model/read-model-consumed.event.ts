import { JSONRecordedEvent } from '@eventstore/db-client'
import { IEvent } from '@nestjs/cqrs'

export class ReadModelConsumedEvent implements IEvent {
  constructor(readonly event: JSONRecordedEvent) {}
}
