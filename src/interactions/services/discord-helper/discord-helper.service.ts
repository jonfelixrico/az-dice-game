import { Injectable } from '@nestjs/common'
import { Client, TextChannel } from 'discord.js'

@Injectable()
export class DiscordHelperService {
  constructor(private client: Client) {}

  async getTextChannel(
    guildId: string,
    channelId: string
  ): Promise<TextChannel> {
    const guild = await this.client.guilds.fetch(guildId)
    const channel = await guild.channels.fetch(channelId)

    if (channel.type !== 'GUILD_TEXT') {
      return null
    }

    return channel as TextChannel
  }
}
