import { Module } from '@nestjs/common'
import { esdbProviders } from './esdb.providers'
import { GameSessionRepositoryService } from './game-session-repository/game-session-repository.service'

@Module({
  providers: [...esdbProviders, GameSessionRepositoryService],
})
export class WriteModelModule {}
