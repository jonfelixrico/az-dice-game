import { Module } from '@nestjs/common'
import { WriteModelModule } from 'src/write-model/write-model.module'
import { typeormProvider } from './typeorm.provider'
import { CatchUpService } from './services/catch-up/catch-up.service'
import { CatchUpNotifierService } from './services/catch-up-notifier/catch-up-notifier.service'

@Module({
  imports: [WriteModelModule],
  providers: [typeormProvider, CatchUpService, CatchUpNotifierService],
  exports: [typeormProvider],
})
export class ReadModelModule {}
