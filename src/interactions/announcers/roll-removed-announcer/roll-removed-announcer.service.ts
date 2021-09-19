import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Message, TextBasedChannels } from 'discord.js'
import { DiscordHelperService } from 'src/interactions/services/discord-helper/discord-helper.service'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'
import { Connection } from 'typeorm'

@EventsHandler(ReadModelSyncedEvent)
export class RollRemovedAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent<IRollRemovedEvent>>
{
  constructor(
    private typeorm: Connection,
    private logger: Logger,
    private helper: DiscordHelperService
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

  async handle({
    domainEvent: event,
  }: ReadModelSyncedEvent<IRollRemovedEvent>) {
    const { payload, type } = event

    if (type !== 'ROLL_REMOVED') {
      return
    }

    const { typeorm } = this
    const { rollId } = payload

    const roll = await typeorm.getRepository(RollDbEntity).findOne({ rollId })
    if (!roll) {
      this.logger.warn(
        `Roll id ${rollId} was not found.`,
        RollRemovedAnnouncerService.name
      )
      return
    }

    const channel = await this.helper.getTextChannel(
      roll.guildId,
      roll.channelId
    )

    const message = await this.fetchMessage(channel, roll.messageId)
    if (!message) {
      // TODO send alt message containing roll details and who deleted it
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
