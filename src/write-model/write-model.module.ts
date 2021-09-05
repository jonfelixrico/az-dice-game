import { Module } from '@nestjs/common'
import { esdbProviders } from './esdb.providers'

@Module({
  providers: [...esdbProviders],
})
export class WriteModelModule {}
