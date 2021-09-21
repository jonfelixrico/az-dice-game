import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import {
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollFormatterService } from 'src/interactions/services/roll-formatter/roll-formatter.service'
import { getMessageLink } from 'src/interactions/utils/discord.utils'
import {
  FindRollByIdQuery,
  FindRollByIdQueryOutput,
} from 'src/query/find-roll-by-id.query'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'

@EventsHandler(ReadModelSyncedEvent)
export class RollRemovedAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent<IRollRemovedEvent>>
{
  constructor(
    private queryBus: QueryBus,
    private logger: Logger,
    private cache: InteractionCache,
    private formatter: RollFormatterService
  ) {}

  /**
   * Edits and adds an extra text in the removed roll's embed to indicate that it has been removed.
   * @param param0
   * @param messageId
   * @returns
   */
  private async findAndEditMessage(
    { channel }: Interaction,
    messageId: string
  ) {
    try {
      const message = await channel.messages.fetch(messageId, { force: true })
      const { content, embeds } = message

      if (!embeds || !embeds.length) {
        return
      }

      const embed = embeds[0]
      // we're doing unshift here because there might be quips in the embed. we want to show the remove notice before the quip
      embed.fields.unshift({
        name: 'This roll has been removed.',
        value: '\u200B',
        inline: false,
      })

      await message.edit({
        content,
        embeds,
      })
    } catch (e) {
      this.logger.error(e.message, e.trace, RollRemovedAnnouncerService.name)
    }
  }

  async handle({
    domainEvent,
    esdbEvent,
  }: ReadModelSyncedEvent<IRollRemovedEvent>) {
    const { payload, type } = domainEvent

    if (type !== 'ROLL_REMOVED') {
      return
    }

    const { queryBus, cache } = this
    const { rollId } = payload

    const roll: FindRollByIdQueryOutput = await queryBus.execute(
      new FindRollByIdQuery({ rollId })
    )

    if (!roll) {
      this.logger.warn(
        `Roll id ${rollId} was not found.`,
        RollRemovedAnnouncerService.name
      )
      return
    }

    const interaction = cache.get(esdbEvent.id)
    if (!interaction) {
      this.logger.warn(
        `Wasn't able to find the interaction for ${esdbEvent.id}`,
        RollRemovedAnnouncerService.name
      )
    }
    cache.del(esdbEvent.id)

    await this.findAndEditMessage(interaction, roll.messageId)

    const formatted = await this.formatter.formatRoll(roll)

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Roll Removed',
      },
      description: [
        `${interaction.user} has removed roll \`${rollId}\`.`,
        '',
        formatted.roll,
        roll.rank
          ? `**${formatted.rank}**; rolled by ${formatted.user}`
          : `Rolled by ${formatted.user}`,
      ].join('\n'),
      color: formatted.color,
    }

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('See Roll')
        .setStyle('LINK')
        .setURL(getMessageLink(roll))
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
