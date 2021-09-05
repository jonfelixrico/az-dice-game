import { Provider } from '@nestjs/common'
import { EventStoreDBClient } from '@eventstore/db-client'
import { ConfigService } from '@nestjs/config'

export const esdbProviders: Provider[] = [
  {
    provide: EventStoreDBClient,
    inject: [ConfigService],
    useFactory: (cfg: ConfigService) =>
      EventStoreDBClient.connectionString(cfg.get('ESDB_URL')),
  },
]
