import { Module } from '@nestjs/common'
import { WriteModelModule } from 'src/write-model/write-model.module'
import { typeormProvider } from './typeorm.provider'
import { CatchUpService } from './catch-up/catch-up.service'

@Module({
  imports: [WriteModelModule],
  providers: [typeormProvider, CatchUpService],
  exports: [typeormProvider],
})
export class ReadModelModule {}
