import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { IBaseEvent } from '../types/base-event.interface'

@Injectable()
export class ChannelWriteRepoService {
  constructor(private client: EventStoreDBClient) {}

  async pushEvent({ payload, type }: IBaseEvent) {
    const { guildId, channelId } = payload

    this.client.appendToStream(
      `${guildId}/${channelId}`,
      jsonEvent({
        type: type,
        data: payload,
      })
    )
  }
}
