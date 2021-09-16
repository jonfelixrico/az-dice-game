import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const HIGHEST_ROLL_COMMAND: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('highestroll')
    .setDescription('Show the highest prize-winning roll so far')
    .toJSON()
