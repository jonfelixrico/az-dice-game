import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import {
  FindRollWithMessageIdQuery,
  FindRollWitHmessageIdQueryOutput,
} from 'src/query/find-roll-with-message-id.query'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IChannelCutoffTimestampSetEvent } from 'src/write-model/types/channel-cutoff-timestamp-set.event'

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

    const { targetId, guildId, channelId, user } = interaction

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

    const oldCutoff: ChannelCutoffTimestampQueryOutput =
      await this.queryBus.execute(
        new ChannelCutoffTimestampQuery({
          channelId,
          guildId,
          useOriginDateIfNotFound: true,
        })
      )

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

    if (newCutoff >= oldCutoff) {
      await interaction.editReply(
        `${user} has set the start of the history to ${newCutoff}.`
      )
      return
    }

    await interaction.editReply(
      `${user} has rewound the start of the history to ${newCutoff}.`
    )
  }
}
