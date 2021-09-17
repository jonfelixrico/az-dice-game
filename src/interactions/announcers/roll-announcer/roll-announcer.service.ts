import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollCreatedEvent } from 'src/write-model/types/roll-created-event.interface'
import { Connection } from 'typeorm'
import { PrizeTierLabels } from 'src/utils/prize-eval'
import {
  HighestRollQuery,
  HighestRollQueryOutput,
} from 'src/query/highest-roll.query'
import { ChannelCutoffTimestampQuery } from 'src/query/channel-cutoff-timestamp.query'

function generateDudRollResponse(roll: RollDbEntity): MessageEmbedOptions {
  return {
    description: `<@${roll.rollOwner}> did not roll a winning combination.`,
  }
}

function generateWinningRollResponse(
  newRoll: RollDbEntity,
  highest: HighestRollQueryOutput
): MessageEmbedOptions {
  const rankText = PrizeTierLabels[newRoll.prizeRank]
  if (newRoll.rollId !== highest?.rollId) {
    return {
      description: `<@${newRoll.rollOwner}> has rolled **${rankText}**.`,
    }
  }

  return {
    description: `<@${newRoll.rollOwner}> has rolled **${rankText}**. They now have the highest roll in <#${newRoll.channelId}>!`,
  }
}
@EventsHandler(ReadModelSyncedEvent)
export class RollAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent>
{
  constructor(
    private interactions: InteractionCache,
    private typeorm: Connection,
    private serializer: RollPresentationSerializerService,
    private queryBus: QueryBus
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

    // TODO use a query for this instead of directly using typeorm
    const roll = await typeorm.getRepository(RollDbEntity).findOne({ rollId })
    if (!roll) {
      // TODO add warn logging
      return
    }

    const { channelId, guildId } = interaction

    const cutoff = await this.queryBus.execute(
      new ChannelCutoffTimestampQuery({ channelId, guildId })
    )

    const highestRoll: HighestRollQueryOutput = await this.queryBus.execute(
      new HighestRollQuery({
        channelId,
        guildId,
        startingFrom: cutoff,
      })
    )

    const responseFragment =
      roll.prizeRank === null
        ? generateDudRollResponse(roll)
        : generateWinningRollResponse(roll, highestRoll)

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
