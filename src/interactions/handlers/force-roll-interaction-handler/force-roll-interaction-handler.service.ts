import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'

@EventsHandler(InteractionCreatedEvent)
export class ForceRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'forceroll') {
      return
    }

    await interaction.deferReply()

    // TODO push roll event here

    // TODO implement rolling
    await interaction.editReply('placeholder')
  }
}
