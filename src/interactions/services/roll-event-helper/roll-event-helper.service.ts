import { Injectable } from '@nestjs/common'
import { Interaction, User } from 'discord.js'
import { random } from 'lodash'
import { nanoid } from 'nanoid'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import {
  IRollCreatedEvent,
  IRollCreatedEventPayload,
  RollType,
} from 'src/write-model/types/roll-created-event.interface'

interface BaseRoll {
  /**
   * From here, we'll be deriving the following payload properties (@see IRollCreatedEventPayload):
   * - channel information (guildId and channelId)
   * - rollOwner and rollBy
   */
  interaction: Interaction
  type: RollType
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
  constructor(private esdbHelper: EsdbHelperService) {}

  /**
   * Utility methods to make the creation of roll events simple. Makes use of
   * Discord object to derive some of the `ROLL_CREATED` payload properties from.
   *
   * @param roll
   * @returns
   */
  async createRoll(
    roll: NaturalRoll | ManualRoll | ProxyRoll
  ): Promise<IRollCreatedEventPayload> {
    const { interaction, type } = roll
    const { guildId, channelId, user } = interaction

    const event: IRollCreatedEvent = {
      type: 'ROLL_CREATED',
      payload: {
        guildId,
        channelId,
        roll:
          type === 'MANUAL'
            ? roll.roll
            : new Array(6).fill(0).map(() => random(1, 6)),
        rollId: nanoid(),
        rolledBy: user.id,
        timestamp: new Date(),
        type,
        rollOwner:
          // manual and proxy allows the user to have a target `rollOwner`
          type === 'MANUAL' || type === 'PROXY' ? roll.rollOwner.id : user.id,
      },
    }

    await this.esdbHelper.pushEvent(event)

    return event.payload
  }
}
