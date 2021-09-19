import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventData,
  JSONEventType,
} from '@eventstore/db-client'
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

  async pushEvent<E extends IBaseEvent>(
    event: E
  ): Promise<JSONEventData<JSONEventType<string, E['payload'], unknown>>> {
    const { payload, type } = event
    const { guildId, channelId } = payload

    const esdbEvent = jsonEvent<JSONEventType<string, E['payload'], unknown>>({
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

    return esdbEvent
  }
}
