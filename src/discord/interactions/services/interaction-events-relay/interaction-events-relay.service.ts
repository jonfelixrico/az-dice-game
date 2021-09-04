import { Injectable, OnModuleInit } from '@nestjs/common'
import { Client, Interaction } from 'discord.js'
import { Subject } from 'rxjs'
import { InteractionBus } from './interaction-bus.class'

@Injectable()
/**
 * Wraps around the Discord client's `interactionCreate` events and relays it as an RxJS observable.
 */
export class InteractionEventsRelayService implements OnModuleInit {
  private subject = new Subject<Interaction>()

  constructor(private client: Client) {}

  get bus$(): InteractionBus {
    return this.subject.asObservable()
  }

  onModuleInit() {
    this.client.on('interactionCreate', (interaction) => {
      this.subject.next(interaction)
    })
  }
}
