import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const MANUAL_ROLL_COMMAND: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('manualroll')
    .setDescription('Roll the dice for another user.')
    .addStringOption((option) =>
      option
        .setName('rollstring')
        .setDescription(
          'A 6-character string with each character consisting of an integer between 1 to 6.'
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('The owner of this manual roll.')
    )
    .toJSON()
