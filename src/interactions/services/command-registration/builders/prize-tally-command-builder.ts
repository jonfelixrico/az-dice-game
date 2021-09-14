import { SlashCommandBuilder } from '@discordjs/builders'

export const PRIZE_TALLY_COMMAND = new SlashCommandBuilder()
  .setName('prizetally')
  .setDescription('Show a tally of how many times a prize has been rolled')
