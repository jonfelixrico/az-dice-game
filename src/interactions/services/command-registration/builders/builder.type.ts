import { SlashCommandBuilder } from '@discordjs/builders'
import { ApplicationCommandTypes } from 'discord.js/typings/enums'

export interface CommandBuilderOutput
  extends ReturnType<SlashCommandBuilder['toJSON']> {
  type?: ApplicationCommandTypes
}
