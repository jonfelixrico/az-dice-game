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
  }
}
