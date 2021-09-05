import { EventStoreDBClient } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GameSessionRepositoryService {
  constructor(private client: EventStoreDBClient) {}

  async findByGuildChannel(guildId: string, channelId: string) {
    const resolved = await this.client.readStream(
      [guildId, channelId].join('/'),
      {
        direction: 'backwards',
        // TODO implement full pagination
        maxCount: 1000,
      }
    )
  }
}
