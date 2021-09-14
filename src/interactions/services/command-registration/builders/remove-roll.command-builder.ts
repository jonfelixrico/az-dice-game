import { SlashCommandBuilder } from '@discordjs/builders'

export const REMOVE_ROLL_COMMAND = new SlashCommandBuilder()
  .setName('removeroll')
  .setDescription('Removes the latest roll made.')
  .addStringOption((option) =>
    option
      .setName('rollid')
      .setDescription(
        'If provided, then the roll associated with this will be removed instead of the latest roll.'
      )
  )
