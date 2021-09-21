import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageActionRow, MessageButton } from 'discord.js'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  parsePrizeLimits,
  rollBreakdownEmbedFormatter,
} from 'src/interactions/utils/roll-breakdown.utils'
import {
  RollBreakdownQuery,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'

const CUSTOM_ID_REGEXP = /breakdown-(.+)/

@EventsHandler(InteractionCreatedEvent)
export class AdvancedBreakdownReloadButtonHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private queryBus: QueryBus) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isButton() ||
      !CUSTOM_ID_REGEXP.test(interaction.customId)
    ) {
      return
    }

    const [limitStr] = CUSTOM_ID_REGEXP.exec(interaction.customId).slice(1)

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
        .setCustomId(`breakdown-${limitStr}`)
        .setLabel('Reload')
        .setStyle('PRIMARY')
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
