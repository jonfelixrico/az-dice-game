import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
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

    await this.helper.pushEvent<IChannelCutoffTimestampSetEvent>({
      type: 'CHANNEL_CUTOFF_TIMESTAMP_SET',
      payload: {
        channelId,
        guildId,
        cutoffTimestamp: new Date(),
        timestamp: new Date(),
        userId: user.id,
      },
    })

    const embed: MessageEmbedOptions = {
      author: {
        name: 'History Cleared',
      },
      description: `${user} has cleared the roll history for this channel.`,
    }

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
