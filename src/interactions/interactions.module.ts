import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { RollInteractionHandlerService } from './handlers/roll-interaction-handler/roll-interaction-handler.service'
import { CommandRegistrationService } from './services/command-registration/command-registration.service'
import { InteractionEventsRelayService } from './services/interaction-events-relay/interaction-events-relay.service'
import { ForceRollInteractionHandlerService } from './handlers/force-roll-interaction-handler/force-roll-interaction-handler.service'
import { ProxyRollInteractionHandlerService } from './handlers/proxy-roll-interaction-handler/proxy-roll-interaction-handler.service'
import { ManualRollInteractionHandlerService } from './handlers/manual-roll-interaction-handler/manual-roll-interaction-handler.service'
import { RollEventHelperService } from './services/roll-event-helper/roll-event-helper.service'
import { WriteModelModule } from 'src/write-model/write-model.module'
import { RollPresentationSerializerService } from './services/roll-presentation-serializer/roll-presentation-serializer.service'
import { interactionCacheProvider } from './providers/interaction-cache.provider'
import { RollAnnouncerService } from './announcers/roll-announcer/roll-announcer.service'
import { RollRemovedAnnouncerService } from './announcers/roll-removed-announcer/roll-removed-announcer.service'
import { HistoryClearInteractionHandlerService } from './handlers/history-clear-interaction-handler/history-clear-interaction-handler.service'
import { HistoryExporterService } from './services/history-exporter/history-exporter.service'
import { HistoryExportInteractionHandlerService } from './handlers/history-export-interaction-handler/history-export-interaction-handler.service'
import { HistoryHighestInteractionHandlerService } from './handlers/history-highest-interaction-handler/history-highest-interaction-handler.service'
import { HistoryLastInteractionHandlerService } from './handlers/history-last-interaction-handler/history-last-interaction-handler.service'
import { HistoryBreakdownInteractionHandlerService } from './handlers/history-breakdown-interaction-handler/history-breakdown-interaction-handler.service'
import { HistoryRemoverollInteractionHandlerService } from './handlers/history-removeroll-interaction-handler/history-removeroll-interaction-handler.service'
import { HistoryRemovelastrollInteractionHandlerService } from './handlers/history-removelastroll-interaction-handler/history-removelastroll-interaction-handler.service'
import { DiscordHelperService } from './services/discord-helper/discord-helper.service'
import { SetCheckpointContextmenuHandlerService } from './handlers/set-checkpoint-contextmenu-handler/set-checkpoint-contextmenu-handler.service'
import { RemoveRollContextmenuHandlerService } from './handlers/remove-roll-contextmenu-handler/remove-roll-contextmenu-handler.service'
import { QuipGeneratorService } from './services/quip-generator/quip-generator.service'
import { HistoryAdvancedbreakdownInteractionHandlerService } from './handlers/history-advancedbreakdown-interaction-handler/history-advancedbreakdown-interaction-handler.service'
import { AdvancedBreakdownReloadButtonHandlerService } from './handlers/advanced-breakdown-reload-button-handler/advanced-breakdown-reload-button-handler.service'
import { HistoryAdvancedexportInteractionHandlerService } from './handlers/history-advancedexport-interaction-handler/history-advancedexport-interaction-handler.service'
import { AdvancedHistoryExporterService } from './services/advanced-history-exporter/advanced-history-exporter.service'
import { RollFormatterService } from './services/roll-formatter/roll-formatter.service'

@Module({
  providers: [
    RollInteractionHandlerService,
    CommandRegistrationService,
    InteractionEventsRelayService,
    ForceRollInteractionHandlerService,
    ProxyRollInteractionHandlerService,
    ManualRollInteractionHandlerService,
    RollEventHelperService,
    RollPresentationSerializerService,
    interactionCacheProvider,
    RollAnnouncerService,
    RollRemovedAnnouncerService,
    HistoryClearInteractionHandlerService,
    HistoryExporterService,
    HistoryExportInteractionHandlerService,
    HistoryHighestInteractionHandlerService,
    HistoryLastInteractionHandlerService,
    HistoryBreakdownInteractionHandlerService,
    HistoryRemoverollInteractionHandlerService,
    HistoryRemovelastrollInteractionHandlerService,
    DiscordHelperService,
    SetCheckpointContextmenuHandlerService,
    RemoveRollContextmenuHandlerService,
    QuipGeneratorService,
    HistoryAdvancedbreakdownInteractionHandlerService,
    AdvancedBreakdownReloadButtonHandlerService,
    HistoryAdvancedexportInteractionHandlerService,
    AdvancedHistoryExporterService,
    RollFormatterService,
  ],
  imports: [DiscordModule, ReadModelModule, WriteModelModule],
})
export class InteractionsModule {}
