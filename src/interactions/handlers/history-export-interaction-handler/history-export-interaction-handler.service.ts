import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { HistoryExporterService } from 'src/interactions/services/history-exporter/history-exporter.service'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'

@EventsHandler(InteractionCreatedEvent)
export class HistoryExportInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private helper: HistoryExporterService) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== 'history' ||
      interaction.options.getSubcommand() !== 'export'
    ) {
      return
    }

    await interaction.deferReply({
      ephemeral: true,
    })

    await interaction.editReply({
      files: [
        {
          attachment: await this.helper.exportData(interaction),
          name: 'yeet.xlsx',
        },
      ],
    })
  }
}
