import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import {
  PrizeTierTallyQuery,
  PrizeTierTallyQueryOutput,
} from 'src/query/prize-tier-tally-query'
import { PRIZE_TIERS } from 'src/utils/prize-tier'

@EventsHandler(InteractionCreatedEvent)
export class HistoryTallyInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private queryBus: QueryBus) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    const { guildId, channelId } = interaction

    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'tally'
    ) {
      return
    }

    await interaction.deferReply()

    const cutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({
          guildId,
          channelId,
          useOriginDateIfNotFound: true,
        })
      )

    const tally: PrizeTierTallyQueryOutput = await this.queryBus.execute(
      new PrizeTierTallyQuery({ guildId, channelId, startingFrom: cutoff })
    )

    const prizeTiers = PRIZE_TIERS.map(({ name, subrank, rank }) => {
      const tallyEntry = tally.find(
        (tally) => tally.rank === rank && tally.subrank === subrank
      )

      return {
        name,
        count: tallyEntry?.count ?? 0,
      }
    })

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Prize Tally',
      },
      description: prizeTiers
        .map(({ name, count }) => `**${name}** - **${count}** matching rolls`)
        .join('\n'),
    }

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
