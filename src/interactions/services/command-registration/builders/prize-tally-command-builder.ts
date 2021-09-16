import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const PRIZE_TALLY_COMMAND: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('prizetally')
    .setDescription('Show a tally of how many times a prize has been rolled')
    .toJSON()
