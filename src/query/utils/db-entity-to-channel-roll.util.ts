import { RollDbEntity } from 'src/read-model/entities/roll.db-entity'
import { ChannelRoll } from '../commons.interfaces'

export function rollDbRecordFormatter({
  roll,
  rollOwner,
  rolledBy,
  rollId,
  prizeRank: rank,
  prizePoints: points,
  timestamp,
}: RollDbEntity): ChannelRoll {
  return {
    rollId,
    roll,
    rollOwner,
    rolledBy,
    rank,
    points,
    timestamp,
  }
}
