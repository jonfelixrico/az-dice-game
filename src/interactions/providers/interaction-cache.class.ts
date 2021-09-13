import LRUCache from 'lru-cache'
import { Interaction } from 'discord.js'

export class InteractionCache extends LRUCache<string, Interaction> {}
