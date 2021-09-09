import { SlashCommandBuilder } from '@discordjs/builders'

export const ROLL_COMMAND = new SlashCommandBuilder()
  .setName('roll')
  .setDescription('Roll the dice.')
