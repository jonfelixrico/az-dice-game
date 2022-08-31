import { IEvent } from '@nestjs/cqrs'
import { Interaction } from 'discord.js'

export class InteractionCreatedEvent implements IEvent {
  constructor(readonly interaction: Interaction) {}
}
