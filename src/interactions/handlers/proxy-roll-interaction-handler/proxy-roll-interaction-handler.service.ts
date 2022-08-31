import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'

@EventsHandler(InteractionCreatedEvent)
export class ProxyRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private rollHelper: RollEventHelperService) {}

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

    const response = await interaction.deferReply({ fetchReply: true })

    await this.rollHelper.createRoll({
      interaction,
      type: 'PROXY',
      rollOwner,
      messageId: response.id,
    })
  }
}
