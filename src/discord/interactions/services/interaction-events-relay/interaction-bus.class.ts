import { Interaction } from 'discord.js'
import { Observable } from 'rxjs'

export class InteractionBus extends Observable<Interaction> {}
