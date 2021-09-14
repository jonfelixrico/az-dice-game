import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { evaluateRoll } from 'src/utils/roll-eval.utils'
import { EventTypes } from 'src/write-model/types/event-types.enum'
import { IRollCreatedEventPayload } from 'src/write-model/types/roll-created-event.interface'
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
  } = data

  const prize = evaluateRoll(roll)

  await manager.insert(RollDbEntity, {
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
  })

  return true
}

type ReducerMap = Record<string, ReducerFn>

const { ROLL_CREATED } = EventTypes

export const REDUCERS: ReducerMap = {
  [ROLL_CREATED]: rollCreated,
}
