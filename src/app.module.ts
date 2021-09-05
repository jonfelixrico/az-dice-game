import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './discord/discord.module'
import { GlobalModule } from './global/global.module'
import { InteractionsModule } from './interactions/interactions.module'
import { WriteModelModule } from './write-model/write-model.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
    }),
    GlobalModule,
    DiscordModule,
    InteractionsModule,
    WriteModelModule,
  ],
})
export class AppModule {}
