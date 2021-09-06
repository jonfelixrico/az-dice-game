import { Module } from '@nestjs/common'
import { typeormProviders } from './typeorm.providers'

@Module({
  providers: [...typeormProviders],
})
export class ReadModelModule {}
