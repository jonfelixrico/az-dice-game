import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'
import { PrizeTierLabels } from 'src/utils/prize-eval'

@EventsHandler(InteractionCreatedEvent)
export class HistoryLastInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private queryBus: QueryBus,
    private serializer: RollPresentationSerializerService
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'last'
    ) {
      return
    }

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])

    const cutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(new ChannelCutoffTimestampQuery(input))

    const lastRoll: LastRollQueryOutput = await this.queryBus.execute(
      new LastRollQuery({
        ...input,
        startingFrom: cutoff,
      })
    )

    if (!lastRoll) {
      await interaction.editReply({
        embeds: [
          {
            author: {
              name: 'Last Roll',
            },
            description: `There are no rolls in ${interaction.channel} yet.`,
          },
        ],
      })
      return
    }

    const { rank, roll, rollOwner } = lastRoll

    const description = !rank
      ? `The last roll in  ${interaction.channel} was made by <@${rollOwner}>.`
      : `The last roll in  ${interaction.channel} was a **${PrizeTierLabels[rank]}** by <@${rollOwner}>.`

    await interaction.editReply({
      content: this.serializer.serializeRoll(roll),
      embeds: [
        {
          description,
          author: {
            name: 'Last Roll',
          },
        },
      ],
    })
  }
}
