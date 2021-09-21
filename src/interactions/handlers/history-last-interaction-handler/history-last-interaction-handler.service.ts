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
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'

@EventsHandler(InteractionCreatedEvent)
export class HistoryLastInteractionHandlerService
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
      interaction.options.getSubcommand() !== 'last'
    ) {
      return
    }

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])
    const lastRoll: LastRollQueryOutput = await this.queryBus.execute(
      new LastRollQuery(input)
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

    const formatted = await this.formatter.formatRoll(lastRoll)

    let rollMessage = `The last roll in ${interaction.channel} was by ${formatted.user}.`
    if (formatted.rank) {
      rollMessage = `The last roll in ${interaction.channel} was a **${formatted.rank}** by${formatted.user}.`
    }

    const embed: MessageEmbedOptions = {
      description: [formatted.roll, '', rollMessage].join('\n'),
      author: {
        name: 'Last Roll',
      },
    }

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(getMessageLink(lastRoll))
        .setLabel('See Roll')
        .setStyle('LINK')
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
