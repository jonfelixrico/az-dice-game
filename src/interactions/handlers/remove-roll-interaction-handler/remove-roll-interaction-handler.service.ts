import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { CommandInteraction, Interaction } from 'discord.js'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'
import { Connection, IsNull } from 'typeorm'

@EventsHandler(InteractionCreatedEvent)
export class RemoveRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private typeorm: Connection, private helper: EsdbHelperService) {}

  private async removeRoll(
    rollId: string,
    { user, channelId, guildId }: Interaction
  ) {
    return await this.helper.pushEvent<IRollRemovedEvent>({
      type: 'ROLL_REMOVED',
      payload: {
        channelId,
        guildId,
        rollId,
        timestamp: new Date(),
        userId: user.id,
      },
    })
  }

  private async handleWithRollId(interaction: CommandInteraction) {
    const { channelId, guildId } = interaction
    const rollId = interaction.options.getString('rollid')

    const roll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: {
        channelId,
        guildId,
        deleteBy: IsNull(),
        rollId,
        // TODO add startingDate
      },
      order: {
        timestamp: 'DESC',
      },
    })

    if (!roll) {
      await interaction.editReply(`Cannot find roll \`${rollId}\`.`)
      return
    }

    await this.removeRoll(roll.rollId, interaction)
  }

  private async handleWithoutRollId(interaction: CommandInteraction) {
    const { channelId, guildId } = interaction

    // TODO move this out as a query
    const lastRoll = await this.typeorm.getRepository(RollDbEntity).findOne({
      where: {
        channelId,
        guildId,
        deleteBy: IsNull(),
        // TODO add startingDate
      },
      order: {
        timestamp: 'DESC',
      },
    })

    if (!lastRoll) {
      await interaction.editReply('There are no rolls left to delete.')
      return
    }

    await this.removeRoll(lastRoll.rollId, interaction)
  }

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'removeroll') {
      return
    }

    await interaction.deferReply()

    if (interaction.options.getString('rollid')) {
      await this.handleWithRollId(interaction)
    } else {
      await this.handleWithoutRollId(interaction)
    }
  }
}
