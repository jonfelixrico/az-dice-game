import { Module } from '@nestjs/common'
import { discordProviders } from './discord.providers'

@Module({
  providers: [...discordProviders],
  exports: discordProviders,
})
export class DiscordModule {}
