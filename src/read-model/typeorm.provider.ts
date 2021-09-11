import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Connection, createConnection } from 'typeorm'
import { ChannelDbEntity } from './entities/channel.db-entity'
import { EntryDbEntity } from './entities/entry.db-entity'
import { RollDbEntity } from './entities/roll.db-entity'

export const typeormProvider: Provider = {
  provide: Connection,
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) =>
    createConnection({
      type: 'sqlite',
      database: 'azdicegamedb',
      synchronize: !!cfg.get('TYPEORM_SYNC'),
      entities: [RollDbEntity, EntryDbEntity, ChannelDbEntity],
    }),
}
