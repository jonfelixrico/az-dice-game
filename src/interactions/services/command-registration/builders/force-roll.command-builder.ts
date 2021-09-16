import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const FORCE_ROLL_COMMAND: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('forceroll')
    .setDescription(
      'Roll the dice, ignores checking of who made the last roll.'
    )
    .toJSON()
