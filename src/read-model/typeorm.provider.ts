import { Provider } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'
import { ChannelDbEntity } from './entities/channel.db-entity'
import { EntryDbEntity } from './entities/entry.db-entity'
import { RollDbEntity } from './entities/roll.db-entity'

export const typeormProvider: Provider = {
  provide: Connection,
  useFactory: () =>
    // we'll get our url from the TYPEORM_URL env var, handled by typeorm internally
    createConnection({
      type: 'postgres',
      database: 'readmodel',
      entities: [RollDbEntity, EntryDbEntity, ChannelDbEntity],
    }),
}
