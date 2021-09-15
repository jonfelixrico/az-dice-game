import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Message, TextBasedChannels } from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'
import { Connection } from 'typeorm'

@EventsHandler(ReadModelSyncedEvent)
export class RollRemovedAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent<IRollRemovedEvent>>
{
  constructor(
    private interactions: InteractionCache,
    private logger: Logger,
    private typeorm: Connection
  ) {}

  private async fetchMessage(
    channel: TextBasedChannels,
    messageId: string
  ): Promise<Message | null> {
    try {
      return channel.messages.fetch(messageId, { force: true })
    } catch (e) {
      this.logger.error(e.message, e.trace, RollRemovedAnnouncerService)
      return null
    }
  }

  async handle({ payload: event }: ReadModelSyncedEvent<IRollRemovedEvent>) {
    const { payload, type } = event

    if (type !== 'ROLL_REMOVED') {
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

    await interaction.editReply('Roll deletion complete.')

    const roll = await typeorm.getRepository(RollDbEntity).findOne({ rollId })
    if (!roll) {
      // TODO add warn logging; this shouldnt be happening
      return
    }

    const { channel } = interaction

    const message = await this.fetchMessage(channel, roll.messageId)
    if (!message) {
      // TODO send alt message, this shouldnt be happening
      return
    }

    await channel.send({
      reply: {
        messageReference: message,
      },
      content: `This roll has been removed by <@${roll.deleteBy}>.`,
    })
  }
}
