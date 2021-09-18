import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { countBy, pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import {
  RollHistoryQuery,
  RollHistoryQueryOutput,
} from 'src/query/roll-history.query'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'

const DUD_KEY = 'DUD'

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
export class HistoryBreakdownInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private queryBus: QueryBus) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'breakdown'
    ) {
      return
    }

    await interaction.deferReply()

    const input = pick(interaction, ['channelId', 'guildId'])

    const cutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(new ChannelCutoffTimestampQuery(input))

    const history: RollHistoryQueryOutput = await this.queryBus.execute(
      new RollHistoryQuery({
        ...input,
        startingFrom: cutoff,
      })
    )

    const counts = countBy(history, ({ rank }) => rank ?? DUD_KEY)

    const rankEntries = RANK_DISPLAY_SEQUENCE.map((rank) => {
      return {
        label: PrizeTierLabels[rank],
        count: counts[rank],
      }
    })

    await interaction.editReply({
      embeds: [
        {
          author: {
            name: 'Roll Breakdown',
          },

          description: [
            ...rankEntries.map(
              ({ label, count }) => `**${label}** - ${count ?? 0}`
            ),
            `**No prize** - ${counts[DUD_KEY] ?? 0}`,
            '',
            history.length !== 1
              ? `There are **${history.length}** rolls made so far.`
              : 'There is **1** roll made so far.',
          ].join('\n'),
        },
      ],
    })
  }
}
