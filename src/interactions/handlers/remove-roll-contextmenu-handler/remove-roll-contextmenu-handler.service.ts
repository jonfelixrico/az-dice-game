import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import {
  FindRollWithMessageIdQuery,
  FindRollWitHmessageIdQueryOutput,
} from 'src/query/find-roll-with-message-id.query'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'

@EventsHandler(InteractionCreatedEvent)
export class RemoveRollContextmenuHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private esdbHelper: EsdbHelperService,
    private queryBus: QueryBus,
    private cache: InteractionCache
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isContextMenu() ||
      interaction.commandName !== 'Remove Roll' ||
      interaction.targetType !== 'MESSAGE'
    ) {
      return
    }

    await interaction.deferReply()

    const { targetId, user } = interaction
    const channelParams = pick(interaction, 'channelId', 'guildId')

    const roll: FindRollWitHmessageIdQueryOutput = await this.queryBus.execute(
      new FindRollWithMessageIdQuery({
        messageId: targetId,
      })
    )
    if (!roll || roll.deleted) {
      await interaction.editReply(
        `${user} attempted to delete an invalid roll.`
      )
      return
    }

    const { id } = await this.esdbHelper.pushEvent<IRollRemovedEvent>({
      type: 'ROLL_REMOVED',
      payload: {
        ...channelParams,
        rollId: roll.rollId,
        timestamp: new Date(),
        userId: interaction.user.id,
      },
    })

    this.cache.set(id, interaction)
  }
}
