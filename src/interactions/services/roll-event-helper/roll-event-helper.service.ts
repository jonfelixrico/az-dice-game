import { Injectable } from '@nestjs/common'
import { CommandInteraction, User } from 'discord.js'
import { random } from 'lodash'
import { customAlphabet } from 'nanoid'
import { InteractionCache } from 'src/interactions/providers/interaction-cache.class'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import {
  IRollCreatedEvent,
  RollType,
} from 'src/write-model/types/roll-created-event.interface'

const generateId = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12
)

interface BaseRoll {
  /**
   * From here, we'll be deriving the following payload properties (@see IRollCreatedEventPayload):
   * - channel information (guildId and channelId)
   * - rollOwner and rollBy
   */
  interaction: CommandInteraction
  type: RollType
  messageId: string
}

interface NaturalRoll extends BaseRoll {
  type: 'NATURAL' | 'NATURAL_FORCED_TURN'
}

/**
 * Base interface for roll types which require a target user
 */
interface BaseProxyRoll extends BaseRoll {
  type: 'MANUAL' | 'PROXY'
  // instead of deriving `rollOwner` from the `interaction`, we'll be getting it from here instead
  rollOwner: User
}

interface ManualRoll extends BaseProxyRoll {
  type: 'MANUAL'
  roll: number[]
}

interface ProxyRoll extends BaseProxyRoll {
  type: 'PROXY'
}

@Injectable()
export class RollEventHelperService {
  constructor(
    private esdbHelper: EsdbHelperService,
    private interactionCache: InteractionCache
  ) {}

  /**
   * Utility methods to make the creation of roll events simple. Makes use of
   * Discord object to derive some of the `ROLL_CREATED` payload properties from.
   *
   * @param roll
   * @returns
   */
  async createRoll(roll: NaturalRoll | ManualRoll | ProxyRoll): Promise<void> {
    const { interaction, type } = roll
    const { guildId, channelId, user } = interaction

    const rollId = generateId()

    const event: IRollCreatedEvent = {
      type: 'ROLL_CREATED',
      payload: {
        guildId,
        channelId,
        roll:
          type === 'MANUAL'
            ? (roll as ManualRoll).roll
            : new Array(6).fill(0).map(() => random(1, 6)),
        rollId,
        rolledBy: user.id,
        timestamp: new Date(),
        type,
        rollOwner:
          // manual and proxy allows the user to have a target `rollOwner`
          type === 'MANUAL' || type === 'PROXY'
            ? (roll as BaseProxyRoll).rollOwner.id
            : user.id,
        messageId: roll.messageId,
      },
    }

    await this.esdbHelper.pushEvent(event)
    this.interactionCache.set(rollId, interaction)
  }
}
