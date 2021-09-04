import { SlashCommandBuilder } from '@discordjs/builders'

export const ROLL_COMMAND = new SlashCommandBuilder()
  .setName('roll')
  .setDescription('Roll the dice.')
  .addBooleanOption((opt) =>
    opt
      .setName('forceturn')
      //  TODO make description more clear; explain turn system
      .setDescription("Force the roll even if it isn't your turn yet")
  )
