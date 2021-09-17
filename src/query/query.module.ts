import { Module } from '@nestjs/common'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { ChannelCutoffTimestampQueryHandlerService } from './handlers/channel-cutoff-timestamp-query-handler/channel-cutoff-timestamp-query-handler.service'
import { LastRollQueryHandlerService } from './handlers/last-roll-query-handler/last-roll-query-handler.service'
import { RollHistoryQueryHandlerService } from './handlers/roll-history-query-handler/roll-history-query-handler.service'

@Module({
  providers: [
    ChannelCutoffTimestampQueryHandlerService,
    LastRollQueryHandlerService,
    RollHistoryQueryHandlerService,
  ],
  imports: [ReadModelModule],
})
export class QueryModule {}
