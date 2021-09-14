import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './discord/discord.module'
import { GlobalModule } from './global/global.module'
import { InteractionsModule } from './interactions/interactions.module'
import { WriteModelModule } from './write-model/write-model.module'
import { ReadModelModule } from './read-model/read-model.module'
import { RollEvalModule } from './roll-eval/roll-eval.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
      cache: true,
    }),
    GlobalModule,
    DiscordModule,
    InteractionsModule,
    WriteModelModule,
    ReadModelModule,
    RollEvalModule,
  ],
})
export class AppModule {}
