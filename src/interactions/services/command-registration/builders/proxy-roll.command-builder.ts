import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const PROXY_ROLL_COMMAND: CommandBuilderOutput =
  new SlashCommandBuilder()
    .setName('proxyroll')
    .setDescription('Roll the dice for another user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you will roll for.')
        .setRequired(true)
    )
    .toJSON()
