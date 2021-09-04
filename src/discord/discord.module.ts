import { Module } from '@nestjs/common'
import { discordProviders } from './discord.providers'
import { InteractionsModule } from './interactions/interactions.module'

@Module({
  providers: [...discordProviders],
  imports: [InteractionsModule],
})
export class DiscordModule {}
