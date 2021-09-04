import { Injectable, OnModuleInit } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { Client } from 'discord.js'
import { InteractionEvent } from './interaction-event.event'

@Injectable()
/**
 * Wraps around the Discord client's `interactionCreate` events and relays it as an RxJS observable.
 */
export class InteractionEventsRelayService implements OnModuleInit {
  constructor(private client: Client, private eventBus: EventBus) {}

  onModuleInit() {
    this.client.on('interactionCreate', (i) =>
      this.eventBus.publish(new InteractionEvent(i))
    )
  }
}
