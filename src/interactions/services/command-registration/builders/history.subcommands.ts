import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const HISTORY_SUBCOMMANDS: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Contains subcommands related to the roll history')
    .addSubcommand((subcommand) =>
      subcommand.setName('clear').setDescription('Wipes the roll history')
    )
    // .addSubcommand((subcommand) =>
    //   subcommand
    //     .setName('export')
    //     .setDescription(
    //       'Export the history and prize breakdown as an XLSX file.'
    //     )
    // )
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
    // .addSubcommand((subcommand) =>
    //   subcommand
    //     .setName('breakdown')
    //     .setDescription('Get the breakdown of rolls and prizes in the channel.')
    // )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('removelastroll')
        .setDescription('Removes the last roll from the channel.')
    )
    // .addSubcommand((subcommand) =>
    //   subcommand
    //     .setName('removeroll')
    //     .setDescription('Remove a specific roll by specifying its id.')
    //     .addStringOption((option) =>
    //       option
    //         .setName('id')
    //         .setDescription('The id of the roll to remove.')
    //         .setRequired(true)
    //     )
    // )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('breakdown')
        .setDescription(
          'An advanced version of /history breakdown; allows you to limit prizes.'
        )
        .addStringOption((option) =>
          option
            .setName('limits')
            .setDescription('Set the limits for each prize.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('export')
        .setDescription(
          'An advanced version of /history export; allows you to limit prizes.'
        )
        .addStringOption((option) =>
          option
            .setName('limits')
            // TODO add proper description
            .setDescription('Set the limits for each prize.')
        )
    )
    .toJSON()
