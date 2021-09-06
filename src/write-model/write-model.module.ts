import { Module } from '@nestjs/common'
import { esdbProviders } from './esdb.providers'
import { ChannelWriteRepoService } from './channel-write-repo/channel-write-repo.service'

@Module({
  providers: [...esdbProviders, ChannelWriteRepoService],
})
export class WriteModelModule {}
