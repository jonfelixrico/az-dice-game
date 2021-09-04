import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
@EventsHandler(InteractionCreatedEvent)
export class RollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'roll') {
      return
    }

    await interaction.deferReply()

    // TODO implement rolling
    await interaction.editReply('hello')
  }
}
