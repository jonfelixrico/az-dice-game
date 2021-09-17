import { SlashCommandBuilder } from '@discordjs/builders'

export type CommandBuilderOutput = ReturnType<SlashCommandBuilder['toJSON']>
