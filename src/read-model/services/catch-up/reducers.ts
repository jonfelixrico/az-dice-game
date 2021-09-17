import {
  JSONEventType,
  JSONRecordedEvent,
  JSONType,
} from '@eventstore/db-client'
import { ChannelDbEntity } from 'src/read-model/entities/channel.db-entity'
import { IChannelCutoffTimestampSetEventPayload } from 'src/write-model/types/channel-cutoff-timestamp-set.event'
import { EventTypes } from 'src/write-model/types/event-types.enum'
import { IRollCreatedEventPayload } from 'src/write-model/types/roll-created-event.interface'
import { IRollRemovedEventPayload } from 'src/write-model/types/roll-removed-event.interface'
import { EntityManager } from 'typeorm'
import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { evaluateRoll } from 'src/utils/prize-eval'

export type ReducerFn<E extends JSONType = JSONType> = (
  event: JSONRecordedEvent<JSONEventType<string, E>>,
  manager: EntityManager
) => Promise<boolean>

const rollCreated: ReducerFn<IRollCreatedEventPayload> = async (
  { data, revision },
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
    prizeRank: prize?.tier,
    prizePoints: prize?.points,
    messageId,
  })

  await manager.save(ChannelDbEntity, {
    channelId,
    guildId,
    revision,
  })

  return true
}

const rollRemoved: ReducerFn<IRollRemovedEventPayload> = async (
  { data, revision },
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

  await manager.save(ChannelDbEntity, {
    channelId,
    guildId,
    revision,
  })

  return true
}

const cutoffSet: ReducerFn<IChannelCutoffTimestampSetEventPayload> = async (
  { data, revision },
  manager
) => {
  const { channelId, guildId, timestamp, userId, cutoffTimestamp } = data

  await manager.getRepository(ChannelDbEntity).save({
    channelId,
    guildId,
    cutoffTimestamp,
    setDt: timestamp,
    setBy: userId,
    revision,
  })

  return true
}

type ReducerMap = Record<string, ReducerFn>

const { ROLL_CREATED, ROLL_REMOVED, CHANNEL_CUTOFF_TIMESTAMP_SET } = EventTypes

export const REDUCERS: ReducerMap = {
  [ROLL_CREATED]: rollCreated,
  [ROLL_REMOVED]: rollRemoved,
  [CHANNEL_CUTOFF_TIMESTAMP_SET]: cutoffSet,
}
