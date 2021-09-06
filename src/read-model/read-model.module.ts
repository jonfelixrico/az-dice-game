import { Module } from '@nestjs/common'
import { WriteModelModule } from 'src/write-model/write-model.module'
import { typeormProviders } from './typeorm.providers'
import { CatchUpService } from './catch-up/catch-up.service'

@Module({
  imports: [WriteModelModule],
  providers: [...typeormProviders, CatchUpService],
})
export class ReadModelModule {}
