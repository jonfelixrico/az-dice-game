import { Module } from '@nestjs/common'
import { RollInteractionHandlerService } from './handlers/roll-interaction-handler/roll-interaction-handler.service'
import { CommandRegistrationService } from './services/command-registration/command-registration.service'
import { InteractionEventsRelayService } from './services/interaction-events-relay/interaction-events-relay.service'

@Module({
  providers: [
    RollInteractionHandlerService,
    CommandRegistrationService,
    InteractionEventsRelayService,
  ],
})
export class InteractionsModule {}
