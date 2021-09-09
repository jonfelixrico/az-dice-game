import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { IBaseEvent } from '../types/base-event.interface'

@Injectable()
export class EsdbHelperService {
  constructor(private client: EventStoreDBClient) {}

  async pushEvent<E extends IBaseEvent>({ payload, type }: E) {
    const { guildId, channelId } = payload

    await this.client.appendToStream(
      `${guildId}/${channelId}`,
      jsonEvent({
        type: type,
        data: payload,
      })
    )
  }
}
