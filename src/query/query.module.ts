import { Module } from '@nestjs/common'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { PrizeTierTallyQueryHandlerService } from './handlers/prize-tier-tally-query-handler/prize-tier-tally-query-handler.service'
import { ChannelCutoffTimestampQueryHandlerService } from './handlers/channel-cutoff-timestamp-query-handler/channel-cutoff-timestamp-query-handler.service'
import { LastRollQueryHandlerService } from './handlers/last-roll-query-handler/last-roll-query-handler.service'

@Module({
  providers: [
    PrizeTierTallyQueryHandlerService,
    ChannelCutoffTimestampQueryHandlerService,
    LastRollQueryHandlerService,
  ],
  imports: [ReadModelModule],
})
export class QueryModule {}
