import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import {
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
} from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { RollPresentationSerializerService } from 'src/interactions/services/roll-presentation-serializer/roll-presentation-serializer.service'
import {
  FindRollByIdQuery,
  FindRollByIdQueryOutput,
} from 'src/query/find-roll-by-id.query'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { PrizeTierLabels } from 'src/utils/prize-eval'
import { IRollRemovedEvent } from 'src/write-model/types/roll-removed-event.interface'

@EventsHandler(ReadModelSyncedEvent)
export class RollRemovedAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent<IRollRemovedEvent>>
{
  constructor(
    private queryBus: QueryBus,
    private logger: Logger,
    private cache: InteractionCache,
    private serializer: RollPresentationSerializerService
  ) {}

  private async findAndEditMessage(
    { channel }: Interaction,
    messageId: string
  ) {
    try {
      const message = await channel.messages.fetch(messageId, { force: true })
      const { content, embeds } = message
      embeds[0]?.fields.push({
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

    const embed: MessageEmbedOptions = {
      author: {
        name: 'Roll Removed',
      },
      description: [
        `${interaction.user} has removed roll \`${roll.rollId}\`.`,
        '',
        this.serializer.serializeRoll(roll.roll),
        roll.rank
          ? `**${PrizeTierLabels[roll.rank]}**; rolled by <@${roll.rollOwner}>`
          : `Rolled by <@${roll.rollOwner}>`,
      ].join('\n'),
    }

    const { channelId, guildId } = interaction

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('See Roll')
        .setStyle('LINK')
        .setURL(
          `https://discord.com/channels/${guildId}/${channelId}/${roll.messageId}`
        )
    )

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    })
  }
}
