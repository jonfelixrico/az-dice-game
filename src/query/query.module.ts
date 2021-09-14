import { Module } from '@nestjs/common'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { HighestWinningRollQueryHandlerService } from './handlers/highest-winning-roll-query-handler/highest-winning-roll-query-handler.service'
import { PrizeTierTallyQueryHandlerService } from './handlers/prize-tier-tally-query-handler/prize-tier-tally-query-handler.service'

@Module({
  providers: [
    HighestWinningRollQueryHandlerService,
    PrizeTierTallyQueryHandlerService,
  ],
  imports: [ReadModelModule],
})
export class QueryModule {}
