import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'

@EventsHandler(InteractionCreatedEvent)
export class ForceRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private rollHelper: RollEventHelperService,
    private serializer: RollPresentationSerializerService
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'forceroll') {
      return
    }

    await interaction.deferReply()

    const rolled = await this.rollHelper.createRoll({
      interaction,
      type: 'NATURAL_FORCED_TURN',
    })

    await interaction.editReply(this.serializer.serializeRoll(rolled.roll))
  }
}
