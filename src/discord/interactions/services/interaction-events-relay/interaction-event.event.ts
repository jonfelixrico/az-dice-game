import { IEvent } from '@nestjs/cqrs'
import { Interaction } from 'discord.js'

export class InteractionEvent implements IEvent {
  constructor(readonly interaction: Interaction) {}
}
