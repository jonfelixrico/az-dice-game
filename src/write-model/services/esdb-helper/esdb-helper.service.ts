import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { WriteModelPublishedEvent } from 'src/write-model/write-model-published.event'
import { IBaseEvent } from '../../types/base-event.interface'

/**
 * This is a helper service to push `IBaseEvent` instances into the ESDB.
 * Emits an internal event to let downstream services that this app instance has pushed an event.
 */
@Injectable()
export class EsdbHelperService {
  constructor(private client: EventStoreDBClient, private eventBus: EventBus) {}

  async pushEvent<E extends IBaseEvent>(event: E): Promise<E> {
    const { payload, type } = event
    const { guildId, channelId } = payload

    const esdbEvent = jsonEvent({
      type: type,
      data: payload,
    })

    await this.client.appendToStream(`${guildId}/${channelId}`, esdbEvent)

    this.eventBus.publish(
      new WriteModelPublishedEvent({
        event,
        eventId: esdbEvent.id,
      })
    )

    return event
  }
}
