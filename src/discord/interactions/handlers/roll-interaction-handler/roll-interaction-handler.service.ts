import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Interaction } from 'discord.js'
@EventsHandler(Interaction)
export class RollInteractionHandlerService
  implements IEventHandler<Interaction>
{
  async handle(interaction: Interaction) {
    if (!interaction.isCommand() || interaction.commandName !== 'roll') {
      return
    }

    await interaction.deferReply()
    await interaction.editReply('hello')
  }
}
