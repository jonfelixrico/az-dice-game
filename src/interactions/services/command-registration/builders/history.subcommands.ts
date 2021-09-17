import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const HISTORY_SUBCOMMANDS: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Contains subcommands related to the roll history')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tally')
        .setDescription(
          'Show a tally of how many times a prize has been rolled'
        )
    )
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
    .toJSON()
