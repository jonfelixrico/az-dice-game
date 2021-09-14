import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollCreatedEvent } from 'src/write-model/types/roll-created-event.interface'
import { Connection } from 'typeorm'

@EventsHandler(ReadModelSyncedEvent)
export class RollAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent>
{
  constructor(
    private interactions: InteractionCache,
    private typeorm: Connection,
    private serializer: RollPresentationSerializerService
  ) {}

  async handle({ payload }: ReadModelSyncedEvent<IRollCreatedEvent>) {
    if (payload.type !== 'ROLL_CREATED') {
      // skipped since this handler is only for ROLL_CREATED
      return
    }

    const { interactions, typeorm } = this

    const { rollId } = payload.payload
    const interaction = interactions.get(rollId)

    if (!interaction) {
      // TODO add warn logging
      return
    }

    interactions.del(rollId)

    const roll = await typeorm.getRepository(RollDbEntity).findOne({ rollId })
    if (!roll) {
      // TODO add warn logging
      return
    }

    const embed: MessageEmbedOptions = {
      description: [
        this.serializer.serializeRoll(roll.roll),
        '',
        `<@${roll.rollOwner}> has rolled <rankplaceholder>.`,
        '',
      ].join(''),
      footer: {
        text: roll.rollId,
      },
    }

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
