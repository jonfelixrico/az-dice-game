import { EventStoreDBClient } from '@eventstore/db-client'
import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { RollInteractionHandlerService } from './handlers/roll-interaction-handler/roll-interaction-handler.service'
import { CommandRegistrationService } from './services/command-registration/command-registration.service'
import { InteractionEventsRelayService } from './services/interaction-events-relay/interaction-events-relay.service'
import { ForceRollInteractionHandlerService } from './handlers/force-roll-interaction-handler/force-roll-interaction-handler.service'
import { ProxyRollInteractionHandlerService } from './handlers/proxy-roll-interaction-handler/proxy-roll-interaction-handler.service'
import { ManualRollInteractionHandlerService } from './handlers/manual-roll-interaction-handler/manual-roll-interaction-handler.service'

@Module({
  providers: [
    RollInteractionHandlerService,
    CommandRegistrationService,
    InteractionEventsRelayService,
    ForceRollInteractionHandlerService,
    ProxyRollInteractionHandlerService,
    ManualRollInteractionHandlerService,
  ],
  imports: [DiscordModule, ReadModelModule, EventStoreDBClient],
})
export class InteractionsModule {}
