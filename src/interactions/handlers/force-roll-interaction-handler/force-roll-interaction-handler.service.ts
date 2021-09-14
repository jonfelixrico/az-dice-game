import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'

@EventsHandler(InteractionCreatedEvent)
export class ForceRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private rollHelper: RollEventHelperService) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'forceroll') {
      return
    }

    await interaction.deferReply()

    await this.rollHelper.createRoll({
      interaction,
      type: 'NATURAL_FORCED_TURN',
    })
  }
}
