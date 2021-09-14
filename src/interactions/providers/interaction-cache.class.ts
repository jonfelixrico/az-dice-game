import LRUCache from 'lru-cache'
import { CommandInteraction } from 'discord.js'

export class InteractionCache extends LRUCache<string, CommandInteraction> {}
