import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './discord/discord.module'
import { GlobalModule } from './global/global.module'
import { InteractionsModule } from './interactions/interactions.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.dev.env', '.env'],
      isGlobal: true,
    }),
    DiscordModule,
    GlobalModule,
    InteractionsModule,
  ],
})
export class AppModule {}
