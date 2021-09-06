import { Provider } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ChannelDbEntity } from './entities/channel.db-entity'
import { EntryDbEntity } from './entities/entry.db-entity'
import { RollDbEntity } from './entities/roll.db-entity'

export const typeormProviders: Provider[] = [
  {
    provide: Connection,
    useFactory: () =>
      createConnection({
        type: 'sqlite',
        database: 'az-dice',
        entities: [RollDbEntity, EntryDbEntity, ChannelDbEntity],
      }),
  },
]
