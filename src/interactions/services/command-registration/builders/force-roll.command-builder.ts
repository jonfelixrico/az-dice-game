import { SlashCommandBuilder } from '@discordjs/builders'

export const FORCE_ROLL_COMMAND = new SlashCommandBuilder()
  .setName('forceroll')
  .setDescription('Roll the dice, ignores checking of who made the last roll.')
