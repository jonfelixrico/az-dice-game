import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { chain, pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  RollBreakdownQuery,
  RollBreakdownQueryInput,
  RollBreakdownQueryOutput,
} from 'src/query/roll-breakdown.query'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'

const LIMITS_REGEXP = /^\d+(?:,\d+){5}$/

const { IT_SIU, DI_KI, SAM_HONG, SI_CHIN, TWI_THENG, CHIONG_GUAN } = PrizeTier
const RANK_DISPLAY_SEQUENCE = [
  CHIONG_GUAN,
  TWI_THENG,
  SI_CHIN,
  SAM_HONG,
  DI_KI,
  IT_SIU,
]

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
    if (!LIMITS_REGEXP.test(limitStr)) {
      await interaction.reply({
        ephemeral: true,
        content: 'Wrong format for `input`.',
      })
      return
    }

    const prizeLimits = chain(limitStr)
      .split(',')
      .map((val, idx) => [idx + 1, parseInt(val)] as [number, number])
      .fromPairs()
      .value() as RollBreakdownQueryInput['prizeLimits']

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])

    const breakdown: RollBreakdownQueryOutput = await this.queryBus.execute(
      new RollBreakdownQuery({
        ...input,
        prizeLimits,
      })
    )

    const { all, ...ranked } = breakdown

    const rankEntries = RANK_DISPLAY_SEQUENCE.map((rank) => {
      const rankedEntry = ranked[rank] ?? []

      const included = rankedEntry.filter(
        ({ excludeFromPrize }) => !excludeFromPrize
      )

      return {
        label: PrizeTierLabels[rank],
        included: included.length,
        excluded: rankedEntry.length - included.length,
      }
    })

    const duds = all.filter(({ rank }) => !rank)

    await interaction.editReply({
      embeds: [
        {
          author: {
            name: 'Roll Breakdown',
          },

          description: [
            ...rankEntries.map(
              ({ label, included, excluded }) =>
                `**${label}** - ${included} (${excluded} excluded)`
            ),
            `**No prize** - ${duds.length}`,
            '',
            all.length !== 1
              ? `There are **${all.length}** rolls made so far.`
              : 'There is **1** roll made so far.',
          ].join('\n'),
        },
      ],
    })
  }
}
