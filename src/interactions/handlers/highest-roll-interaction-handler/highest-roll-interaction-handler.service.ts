import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import {
  HighestWinningRollQuery,
  HighestWinningRollQueryOutput,
} from 'src/query/highest-winning-roll.query'
import { getPrizeTier } from 'src/utils/roll-eval.utils'

@EventsHandler(InteractionCreatedEvent)
export class HighestRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private queryBus: QueryBus,
    private serializer: RollPresentationSerializerService
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    const { guildId, channelId } = interaction

    if (!interaction.isCommand() || interaction.commandName !== 'highestroll') {
      return
    }

    await interaction.deferReply()

    const highestRoll: HighestWinningRollQueryOutput =
      await this.queryBus.execute(
        new HighestWinningRollQuery({ guildId, channelId })
      )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Highest Roll',
      },
    }

    if (!highestRoll) {
      embed.description =
        'There are currently no winning rolls to be hailed as the highest roll.'
    } else {
      const { rollOwner, roll, rank, subrank, timestamp } = highestRoll
      const tier = getPrizeTier(rank, subrank)

      embed.description = [
        this.serializer.serializeRoll(roll),
        '',
        `<@${rollOwner}> rolled **${tier.name}** at ${timestamp}`,
      ].join('\n')
    }

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
