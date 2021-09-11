import { Module } from '@nestjs/common'
import { EsdbHelperService } from './services/esdb-helper/esdb-helper.service'
import { esdbProvider } from './esdb.provider'

@Module({
  providers: [esdbProvider, EsdbHelperService],
  exports: [esdbProvider, EsdbHelperService],
})
export class WriteModelModule {}
