import { Injectable } from '@nestjs/common'
import { Interaction, User } from 'discord.js'
import { random } from 'lodash'
import { nanoid } from 'nanoid'
import { EsdbHelperService } from 'src/write-model/services/esdb-helper/esdb-helper.service'
import {
  IRollCreatedEvent,
  RollType,
} from 'src/write-model/types/roll-created-event.interface'

interface BaseRoll {
  interaction: Interaction
  type: RollType
}

interface NaturalRoll extends BaseRoll {
  type: 'NATURAL' | 'NATURAL_FORCED_TURN'
}

interface BaseProxyRoll extends BaseRoll {
  type: 'MANUAL' | 'PROXY'
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

  async createRoll(roll: NaturalRoll | ManualRoll | ProxyRoll) {
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
          type === 'MANUAL' || type === 'PROXY' ? roll.rollOwner.id : user.id,
      },
    }

    await this.esdbHelper.pushEvent(event)

    return event.payload
  }
}
