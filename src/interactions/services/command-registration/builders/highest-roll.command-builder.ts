import { SlashCommandBuilder } from '@discordjs/builders'

export const HIGHEST_ROLL_COMMAND = new SlashCommandBuilder()
  .setName('highestroll')
  .setDescription('Show the highest prize-winning roll so far')
