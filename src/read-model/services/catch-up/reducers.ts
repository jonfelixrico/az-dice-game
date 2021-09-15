import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { evaluateRoll } from 'src/utils/roll-eval.utils'
import { EventTypes } from 'src/write-model/types/event-types.enum'
import { IRollCreatedEventPayload } from 'src/write-model/types/roll-created-event.interface'
import { IRollRemovedEventPayload } from 'src/write-model/types/roll-removed-event.interface'
import { EntityManager } from 'typeorm'
import { RollDbEntity } from '../../entities/roll.db-entity'

export type ReducerFn<E extends JSONType = JSONType> = (
  event: JSONRecordedEvent<JSONEventType<string, E>>,
  manager: EntityManager
) => Promise<boolean>

const rollCreated: ReducerFn<IRollCreatedEventPayload> = async (
  { data },
  manager
) => {
  const {
    channelId,
    guildId,
    roll,
    rollId,
    rollOwner,
    rolledBy,
    timestamp,
    type,
    messageId,
  } = data

  const prize = evaluateRoll(roll)

  await manager.insert(RollDbEntity, {
    id: [rollId, channelId].join('/'),
    channelId,
    guildId,
    roll,
    rollId,
    rollOwner,
    timestamp,
    type,
    rolledBy,
    prizeRank: prize?.rank,
    prizeSubrank: prize?.subrank,
    messageId,
  })

  return true
}

const rollRemoved: ReducerFn<IRollRemovedEventPayload> = async (
  { data },
  manager
) => {
  const { rollId, userId, timestamp, channelId, guildId } = data

  await manager.getRepository(RollDbEntity).update(
    {
      rollId,
      channelId,
      guildId,
    },
    {
      deleteDt: timestamp,
      deleteBy: userId,
    }
  )

  return true
}

type ReducerMap = Record<string, ReducerFn>

const { ROLL_CREATED, ROLL_REMOVED } = EventTypes

export const REDUCERS: ReducerMap = {
  [ROLL_CREATED]: rollCreated,
  [ROLL_REMOVED]: rollRemoved,
}
