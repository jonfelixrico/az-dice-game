import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { MessageEmbedOptions } from 'discord.js'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { ReadModelSyncedEvent } from 'src/read-model/read-model-synced.event'
import { IRollCreatedEvent } from 'src/write-model/types/roll-created-event.interface'
import {
  HighestRollQuery,
  HighestRollQueryOutput,
} from 'src/query/highest-roll.query'
import { QuipGeneratorService } from 'src/interactions/services/quip-generator/quip-generator.service'
import { pick } from 'lodash'
import { RollFormatterService } from 'src/interactions/services/roll-formatter/roll-formatter.service'
import {
  FindRollByIdQuery,
  FindRollByIdQueryOutput,
} from 'src/query/find-roll-by-id.query'
import { ChannelRoll } from 'src/query/commons.interfaces'

@EventsHandler(ReadModelSyncedEvent)
export class RollAnnouncerService
  implements IEventHandler<ReadModelSyncedEvent>
{
  constructor(
    private interactions: InteractionCache,
    private queryBus: QueryBus,
    private quipGenerator: QuipGeneratorService,
    private formatter: RollFormatterService
  ) {}

  async handle({
    domainEvent: event,
  }: ReadModelSyncedEvent<IRollCreatedEvent>) {
    const { payload, type } = event
    if (type !== 'ROLL_CREATED') {
      // skipped since this handler is only for ROLL_CREATED
      return
    }

    const { interactions, queryBus } = this

    const { rollId } = payload
    const interaction = interactions.get(rollId)

    if (!interaction) {
      // TODO add warn logging
      return
    }

    interactions.del(rollId)

    const newRoll: FindRollByIdQueryOutput = await this.queryBus.execute(
      new FindRollByIdQuery({ rollId })
    )
    if (!newRoll) {
      // TODO add warn logging
      return
    }

    const formatted = await this.formatter.formatRoll(newRoll)
    const commons: MessageEmbedOptions = {
      footer: {
        text: newRoll.rollId,
      },
      ...this.getQuip(newRoll),
    }

    if (!newRoll.rank) {
      const embed: MessageEmbedOptions = {
        description: `${formatted.user} did not roll a winning combination.`,
        ...commons,
      }

      await interaction.editReply({
        content: formatted.roll,
        embeds: [embed],
      })

      return
    }

    const highestRoll: HighestRollQueryOutput = await queryBus.execute(
      new HighestRollQuery(pick(interaction, 'channelId', 'guildId'))
    )

    const embed: MessageEmbedOptions = {
      ...commons,
      color: formatted.color,
    }

    if (newRoll.rollId !== highestRoll?.rollId) {
      embed.description = `${formatted.user} has rolled **${formatted.rank}**.`
    } else {
      embed.description = `${formatted.user} has rolled **${formatted.rank}**. They now have the highest roll in <#${newRoll.channelId}>!`
    }

    await interaction.editReply({
      content: formatted.roll,
      embeds: [embed],
    })
  }

  private getQuip({ rank }: ChannelRoll): MessageEmbedOptions {
    const embed: MessageEmbedOptions = {}

    const quip = this.quipGenerator.getQuipForRank(rank)

    if (quip?.image) {
      embed.image = {
        url: quip.image,
      }
    }

    if (quip?.text) {
      embed.fields = [
        {
          name: '\u200B',
          value: `> ${quip.text}`,
        },
      ]
    }

    return embed
  }
}
