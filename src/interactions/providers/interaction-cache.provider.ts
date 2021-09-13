import { Provider } from '@nestjs/common'
import LRUCache from 'lru-cache'
import { InteractionCache } from './interaction-cache.class'
import { Interaction } from 'discord.js'

export const interactionCacheProvider: Provider = {
  provide: InteractionCache,
  useFactory: () =>
    new LRUCache<string, Interaction>({
      maxAge: 1000 * 60 * 15,
      updateAgeOnGet: true,
    }),
}
