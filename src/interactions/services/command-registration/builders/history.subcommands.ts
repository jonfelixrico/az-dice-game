import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const HISTORY_SUBCOMMANDS: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Contains subcommands related to the roll history')
    .addSubcommand((subcommand) =>
      subcommand.setName('clear').setDescription('Wipes the roll history')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('export')
        .setDescription(
          'Export the history and prize breakdown as an XLSX file.'
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('highest')
        .setDescription('Get the highest roll in the channel.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('last')
        .setDescription('Get the last roll in the channel.')
    )
    .toJSON()
