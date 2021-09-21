import { Injectable } from '@nestjs/common'
import { Client, GuildMember, TextChannel } from 'discord.js'

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

  /**
   * Fetches the `GuildMember` object of the specified user in a guild
   * @param guildId Snowflake of a guild
   * @param userId Snoflake of a user
   * @returns
   */
  async getGuildMember(guildId: string, userId: string): Promise<GuildMember> {
    const guild = await this.client.guilds.fetch(guildId)

    if (!guild) {
      return null
    }

    return guild.members.fetch(userId)
  }
}
