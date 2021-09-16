import { Module } from '@nestjs/common'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { HighestWinningRollQueryHandlerService } from './handlers/highest-winning-roll-query-handler/highest-winning-roll-query-handler.service'
import { PrizeTierTallyQueryHandlerService } from './handlers/prize-tier-tally-query-handler/prize-tier-tally-query-handler.service'
import { ChannelCutoffTimestampQueryHandlerService } from './handlers/channel-cutoff-timestamp-query-handler/channel-cutoff-timestamp-query-handler.service'

@Module({
  providers: [
    HighestWinningRollQueryHandlerService,
    PrizeTierTallyQueryHandlerService,
    ChannelCutoffTimestampQueryHandlerService,
  ],
  imports: [ReadModelModule],
})
export class QueryModule {}
