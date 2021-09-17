import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { TextChannel } from 'discord.js'
import { HistoryExporterService } from 'src/interactions/services/history-exporter/history-exporter.service'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'

@EventsHandler(InteractionCreatedEvent)
export class HistoryExportInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private exporter: HistoryExporterService) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'export'
    ) {
      return
    }

    await interaction.deferReply()

    const data = await this.exporter.exportData(interaction)
    await interaction.editReply({
      files: [
        {
          attachment: data,
          name: `${(interaction.channel as TextChannel).name}.xlsx`,
        },
      ],
    })
  }
}
