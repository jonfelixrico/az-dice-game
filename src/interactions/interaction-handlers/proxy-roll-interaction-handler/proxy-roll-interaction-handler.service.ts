import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'

@EventsHandler(InteractionCreatedEvent)
export class ProxyRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private rollHelper: RollEventHelperService,
    private serializer: RollPresentationSerializerService
  ) {}

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

    const rolled = await this.rollHelper.createRoll({
      interaction,
      type: 'PROXY',
      rollOwner,
    })

    await interaction.editReply(this.serializer.serializeRoll(rolled.roll))
  }
}
