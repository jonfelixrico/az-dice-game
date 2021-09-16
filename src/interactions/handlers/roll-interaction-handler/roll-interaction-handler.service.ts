import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'

@EventsHandler(InteractionCreatedEvent)
export class RollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private rollHelper: RollEventHelperService,
    private queryBus: QueryBus
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'roll') {
      return
    }

    const { channelId, guildId } = interaction

    const response = await interaction.deferReply({ fetchReply: true })

    const cutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({ channelId, guildId })
      )

    const lastRoll: LastRollQueryOutput = await this.queryBus.execute(
      new LastRollQuery({ channelId, guildId, startingFrom: cutoff })
    )

    if (lastRoll && lastRoll.rollOwner === interaction.user.id) {
      await interaction.editReply(
        `The roll of ${interaction.user} was blocked because they were the owner of the last roll.`
      )
      return
    }

    await this.rollHelper.createRoll({
      interaction,
      type: 'NATURAL',
      messageId: response.id,
    })
  }
}
