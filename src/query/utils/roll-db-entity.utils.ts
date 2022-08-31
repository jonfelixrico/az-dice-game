import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ChannelRoll } from '../commons.interfaces'

export function formatRollRecordToQueryOutput({
  roll,
  rollOwner,
  rolledBy,
  rollId,
  prizeRank: rank,
  prizePoints: points,
  timestamp,
  messageId,
  deleteBy,
  deleteDt,
  channelId,
  guildId,
}: RollDbEntity): ChannelRoll {
  return {
    rollId,
    roll,
    rollOwner,
    rolledBy,
    rank,
    points,
    timestamp,
    messageId,
    deleted: deleteBy
      ? {
          timestamp: deleteDt,
          userId: deleteBy,
        }
      : null,
    channelId,
    guildId,
  }
}
