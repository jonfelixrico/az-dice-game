import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions, TextChannel } from 'discord.js'
import { pick } from 'lodash'
import { DateTime } from 'luxon'
import { AdvancedHistoryExporterService } from 'src/interactions/services/advanced-history-exporter/advanced-history-exporter.service'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  parsePrizeLimits,
  PRIZE_LIMITS_REGEXP,
} from 'src/interactions/utils/roll-breakdown.utils'
import { ChannelCutoffTimestampQuery } from 'src/query/channel-cutoff-timestamp.query'
import {
  PrizeLimits,
  RollBreakdownQuery,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'

const { IT_SIU, DI_KI, SAM_HONG, SI_CHIN, TWI_THENG, CHIONG_GUAN } = PrizeTier
const RANK_DISPLAY_SEQUENCE = [
  IT_SIU,
  DI_KI,
  SAM_HONG,
  SI_CHIN,
  TWI_THENG,
  CHIONG_GUAN,
]

function displayLimits(limits: PrizeLimits): string {
  return RANK_DISPLAY_SEQUENCE.map(
    (rankCode) => `**${limits[rankCode] ?? 0}** ${PrizeTierLabels[rankCode]}`
  ).join('\n')
}

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

    const channelInfo = pick(interaction, ['channelId', 'guildId'])

    const breakdown: RollBreakdownQueryOutput = await this.queryBus.execute(
      new RollBreakdownQuery({
        ...channelInfo,
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

    const end = DateTime.now().toLocaleString(
      DateTime.DATETIME_MED_WITH_SECONDS
    )
    const start = DateTime.fromJSDate(
      await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({
          ...channelInfo,
          useOriginDateIfNotFound: true,
        })
      )
    ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Export History',
      },
      description: [
        `Exported breakdown of rolls from **${start}** to **${end}**`,
        '',
        '**Prize limits**',
        displayLimits(prizeLimits),
      ].join('\n'),
    }

    await interaction.editReply({
      embeds: [embed],
      files: [
        {
          attachment: xlsxBuffer,
          name: `${channelName}-${nowString}.xlsx`,
        },
      ],
    })
  }
}
