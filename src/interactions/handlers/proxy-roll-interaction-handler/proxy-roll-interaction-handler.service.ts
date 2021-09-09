import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'

@EventsHandler(InteractionCreatedEvent)
export class ProxyRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'proxyroll') {
      return
    }

    const rollOwner = interaction.options.getUser('user')

    if (interaction.user.equals(rollOwner)) {
      await interaction.reply({
        ephemeral: true,
        content:
          'You assigned yourself as the user. Please use /roll or /forceroll instead.',
      })
      return
    }

    await interaction.deferReply()

    // TODO send roll event

    await interaction.editReply('placeholder')
  }
}
