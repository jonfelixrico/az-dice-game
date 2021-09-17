import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollCreatedEvent } from 'src/write-model/types/roll-created-event.interface'
import { Connection } from 'typeorm'
import { PrizeTier, PrizeTierLabels } from 'src/utils/prize-eval'

function generateDudRollResponse(roll: RollDbEntity): MessageEmbedOptions {
  return {
    description: `<@${roll.rollOwner}> did not roll a winning combination.`,
  }
}

function generateWinningRollResponse(
  roll: RollDbEntity,
  rank: PrizeTier
): MessageEmbedOptions {
  return {
    description: `<@${roll.rollOwner}> has rolled **${PrizeTierLabels[rank]}**`,
  }
}
@EventsHandler(ReadModelSyncedEvent)
export class RollAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent>
{
  constructor(
    private interactions: InteractionCache,
    private typeorm: Connection,
    private serializer: RollPresentationSerializerService
  ) {}

  async handle({ payload: event }: ReadModelSyncedEvent<IRollCreatedEvent>) {
    const { payload, type } = event
    if (type !== 'ROLL_CREATED') {
      // skipped since this handler is only for ROLL_CREATED
      return
    }

    const { interactions, typeorm } = this

    const { rollId } = payload
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

    const responseFragment =
      roll.prizeRank === null
        ? generateDudRollResponse(roll)
        : generateWinningRollResponse(roll, roll.prizeRank)

    const embed: MessageEmbedOptions = {
      footer: {
        text: roll.rollId,
      },
      ...responseFragment,
    }

    await interaction.editReply({
      content: this.serializer.serializeRoll(roll.roll),
      embeds: [embed],
    })
  }
}
