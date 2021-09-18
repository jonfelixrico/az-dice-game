import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { pick } from 'lodash'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { LastRollQuery, LastRollQueryOutput } from 'src/query/last-roll.query'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'

@EventsHandler(InteractionCreatedEvent)
export class HistoryRemovelastrollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private helper: EsdbHelperService, private queryBus: QueryBus) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'removelastroll'
    ) {
      return
    }

    await interaction.deferReply({ ephemeral: true })

    const channelParams = pick(interaction, 'guildId', 'channelId')
    const lastRoll: LastRollQueryOutput = await this.queryBus.execute(
      new LastRollQuery(channelParams)
    )

    if (!lastRoll) {
      await interaction.editReply('No rolls have been made yet.')
      return
    }

    await this.helper.pushEvent<IRollRemovedEvent>({
      type: 'ROLL_REMOVED',
      payload: {
        ...channelParams,
        rollId: lastRoll.rollId,
        timestamp: new Date(),
        userId: interaction.user.id,
      },
    })

    await interaction.editReply(
      `You have successfully deleted roll \`${lastRoll.rollId}\`.`
    )
  }
}
