import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import {
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollFormatterService } from 'src/interactions/services/roll-formatter/roll-formatter.service'
import { getMessageLink } from 'src/interactions/utils/discord.utils'
import {
  HighestRollQuery,
  HighestRollQueryOutput,
} from 'src/query/highest-roll.query'

@EventsHandler(InteractionCreatedEvent)
export class HistoryHighestInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private queryBus: QueryBus,
    private formatter: RollFormatterService
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

    const highestRoll: HighestRollQueryOutput = await this.queryBus.execute(
      new HighestRollQuery(input)
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

    const formatted = await this.formatter.formatRoll(highestRoll)

    const embed: MessageEmbedOptions = {
      description: [
        formatted.roll,
        '',
        `${formatted.user} holds the highest roll in ${interaction.channel} with **${formatted.rank}**.`,
      ].join('\n'),
      author: {
        name: 'Highest Roll',
      },
      color: formatted.color,
    }

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(getMessageLink(highestRoll))
        .setLabel('See Roll')
        .setStyle('LINK')
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
