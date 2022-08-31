import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { DateTime } from 'luxon'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IChannelCutoffTimestampSetEvent } from 'src/write-model/types/channel-cutoff-timestamp-set.event'

@EventsHandler(InteractionCreatedEvent)
export class HistoryClearInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private helper: EsdbHelperService) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'clear'
    ) {
      return
    }

    await interaction.deferReply()

    const { channelId, guildId, user } = interaction
    const cutoffTs = DateTime.now()

    await this.helper.pushEvent<IChannelCutoffTimestampSetEvent>({
      type: 'CHANNEL_CUTOFF_TIMESTAMP_SET',
      payload: {
        channelId,
        guildId,
        cutoffTimestamp: cutoffTs.toJSDate(),
        timestamp: new Date(),
        userId: user.id,
      },
    })

    const formattedCutoff = cutoffTs.toLocaleString(
      DateTime.DATETIME_MED_WITH_SECONDS
    )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'History Cleared',
      },
      description: [
        `${user} has cleared the roll history for this channel.`,
        `Only rolls made on or after **${formattedCutoff}** will be included in the output of \`/history\` commands.`,
      ].join('\n'),
    }

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
