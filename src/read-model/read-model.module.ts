import { Module } from '@nestjs/common'
import { WriteModelModule } from 'src/write-model/write-model.module'
import { typeormProviders } from './typeorm.providers'

@Module({
  imports: [WriteModelModule],
  providers: [...typeormProviders],
})
export class ReadModelModule {}
