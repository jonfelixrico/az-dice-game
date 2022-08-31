import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { DateTime } from 'luxon'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  FindRollWithMessageIdQuery,
  FindRollWitHmessageIdQueryOutput,
} from 'src/query/find-roll-with-message-id.query'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IChannelCutoffTimestampSetEvent } from 'src/write-model/types/channel-cutoff-timestamp-set.event'
import {
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'
import { getMessageLink } from 'src/interactions/utils/discord.utils'

@EventsHandler(InteractionCreatedEvent)
export class SetCheckpointContextmenuHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private esdbHelper: EsdbHelperService,
    private queryBus: QueryBus
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isContextMenu() ||
      interaction.commandName !== 'Set Checkpoint' ||
      interaction.targetType !== 'MESSAGE'
    ) {
      return
    }

    await interaction.deferReply()

    const { targetId, guildId, channelId, user, channel } = interaction

    const roll: FindRollWitHmessageIdQueryOutput = await this.queryBus.execute(
      new FindRollWithMessageIdQuery({
        messageId: targetId,
      })
    )
    if (!roll) {
      await interaction.editReply(
        `${user} attempted to set the history checkpoint to an invalid target.`
      )
      return
    }

    const newCutoff = roll.timestamp

    await this.esdbHelper.pushEvent<IChannelCutoffTimestampSetEvent>({
      type: 'CHANNEL_CUTOFF_TIMESTAMP_SET',
      payload: {
        channelId,
        guildId,
        cutoffTimestamp: newCutoff,
        timestamp: new Date(),
        userId: user.id,
      },
    })

    const formattedCutoff = DateTime.fromJSDate(newCutoff).toLocaleString(
      DateTime.DATETIME_MED_WITH_SECONDS
    )

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(getMessageLink(roll))
        .setLabel('See cutoff roll')
        .setStyle('LINK')
    )

    const embed: MessageEmbedOptions = {
      author: {
        name: 'History Cutoff Set',
      },
      description: [
        `${user} has set the history cutoff of ${channel} to **${formattedCutoff}**.`,
        'Only rolls made on or after this date will be included in the results of `/history` commands.',
      ].join('\n'),
    }

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
