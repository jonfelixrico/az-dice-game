import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandBuilderOutput } from './builder.type'

export const ROLL_COMMAND: CommandBuilderOutput = new SlashCommandBuilder()
  .setName('roll')
  .setDescription('Roll the dice.')
  .toJSON()
