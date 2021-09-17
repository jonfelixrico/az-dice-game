import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import {
  HighestRollQuery,
  HighestRollQueryOutput,
} from 'src/query/highest-roll.query'
import { PrizeTierLabels } from 'src/utils/prize-eval'

@EventsHandler(InteractionCreatedEvent)
export class HistoryHighestInteractionHandlerService
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
      interaction.options.getSubcommand() !== 'highest'
    ) {
      return
    }

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])

    const cutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(new ChannelCutoffTimestampQuery(input))

    const highestRoll: HighestRollQueryOutput = await this.queryBus.execute(
      new HighestRollQuery({
        ...input,
        startingFrom: cutoff,
      })
    )

    if (!highestRoll) {
      await interaction.editReply({
        embeds: [
          {
            author: {
              name: 'Highest Roll',
            },
            description: `There are no prize-winning rolls in ${interaction.channel} yet.`,
          },
        ],
      })
      return
    }

    const { rank, roll, rollOwner } = highestRoll

    await interaction.editReply({
      content: this.serializer.serializeRoll(roll),
      embeds: [
        {
          description: `<@${rollOwner}> holds the highest roll in ${interaction.channel} with **${PrizeTierLabels[rank]}**.`,
          author: {
            name: 'Highest Roll',
          },
        },
      ],
    })
  }
}
