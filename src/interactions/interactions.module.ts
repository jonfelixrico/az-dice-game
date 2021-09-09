import { EventStoreDBClient } from '@eventstore/db-client'
import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReadModelModule } from 'src/read-model/read-model.module'
import { RollInteractionHandlerService } from './handlers/roll-interaction-handler/roll-interaction-handler.service'
import { CommandRegistrationService } from './services/command-registration/command-registration.service'
import { InteractionEventsRelayService } from './services/interaction-events-relay/interaction-events-relay.service'

@Module({
  providers: [
    RollInteractionHandlerService,
    CommandRegistrationService,
    InteractionEventsRelayService,
  ],
  imports: [DiscordModule, ReadModelModule, EventStoreDBClient],
})
export class InteractionsModule {}
