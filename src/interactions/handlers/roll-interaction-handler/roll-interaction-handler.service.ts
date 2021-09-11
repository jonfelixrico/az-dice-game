import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { Connection, IsNull, Not } from 'typeorm'

@EventsHandler(InteractionCreatedEvent)
export class RollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(
    private typeorm: Connection,
    private rollHelper: RollEventHelperService
  ) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'roll') {
      return
    }

    await interaction.deferReply()

    const lastRoll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: {
        deleteDt: Not(IsNull()),
        channelId: interaction.channelId,
      },
    })

    if (lastRoll && lastRoll.rollOwner === interaction.user.id) {
      await interaction.editReply(
        `The roll of ${interaction.user} was blocked because they were the owner of the last roll.`
      )
    }

    const rolled = await this.rollHelper.createRoll({
      interaction,
      type: 'NATURAL',
    })

    // TODO create formatter for this
    await interaction.editReply(JSON.stringify(rolled.roll))
  }
}
