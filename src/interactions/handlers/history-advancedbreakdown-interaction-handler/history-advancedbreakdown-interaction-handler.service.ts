import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageActionRow, MessageButton } from 'discord.js'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  parsePrizeLimits,
  PRIZE_LIMITS_REGEXP,
} from 'src/interactions/utils/roll-breakdown.utils'
import {
  RollBreakdownQuery,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'
import { rollBreakdownEmbedFormatter } from './../../utils/roll-breakdown.utils'

@EventsHandler(InteractionCreatedEvent)
export class HistoryAdvancedbreakdownInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private queryBus: QueryBus) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'advancedbreakdown'
    ) {
      return
    }

    const limitStr = interaction.options.getString('limits')
    if (!PRIZE_LIMITS_REGEXP.test(limitStr)) {
      await interaction.reply({
        ephemeral: true,
        content: 'Wrong format for `input`.',
      })
      return
    }

    const prizeLimits = parsePrizeLimits(limitStr)

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])

    const breakdown: RollBreakdownQueryOutput = await this.queryBus.execute(
      new RollBreakdownQuery({
        ...input,
        prizeLimits,
      })
    )

    const embed = rollBreakdownEmbedFormatter(breakdown, prizeLimits)

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`advancedbreakdown-${limitStr}`)
        .setLabel('Reload')
        .setStyle('PRIMARY')
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
