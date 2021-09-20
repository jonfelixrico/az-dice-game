import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { TextChannel } from 'discord.js'
import { pick } from 'lodash'
import { DateTime } from 'luxon'
import { AdvancedHistoryExporterService } from 'src/interactions/services/advanced-history-exporter/advanced-history-exporter.service'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  parsePrizeLimits,
  PRIZE_LIMITS_REGEXP,
} from 'src/interactions/utils/roll-breakdown.utils'
import {
  RollBreakdownQuery,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'

@EventsHandler(InteractionCreatedEvent)
export class HistoryAdvancedexportInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private queryBus: QueryBus,
    private exporter: AdvancedHistoryExporterService
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'advancedexport'
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

    const xlsxBuffer = await this.exporter.generateWorkBook(
      breakdown,
      prizeLimits
    )

    const channelName = (interaction.channel as TextChannel).name
    const nowString = DateTime.now()
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      .replace(/ /gi, '-')

    await interaction.editReply({
      files: [
        {
          attachment: xlsxBuffer,
          name: `${channelName}-${nowString}.xlsx`,
        },
      ],
    })
  }
}
