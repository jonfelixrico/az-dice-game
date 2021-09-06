import { Module } from '@nestjs/common'
import { ChannelWriteRepoService } from './channel-write-repo/channel-write-repo.service'
import { esdbProvider } from './esdb.provider'

@Module({
  providers: [esdbProvider, ChannelWriteRepoService],
  exports: [esdbProvider, ChannelWriteRepoService],
})
export class WriteModelModule {}
