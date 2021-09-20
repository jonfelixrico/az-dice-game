/**
 * Interface for querying something from a channel's roll history
 */
export interface ChannelHistoryQueryParams {
  channelId: string
  guildId: string

  // providing this will only include rolls starting form the specified datetime
  startingFrom?: Date
}

/**
 * Interface that represents a roll from a channel
 */
export interface ChannelRoll {
  rank?: number
  points?: number
  rollOwner: string
  roll: number[]
  rolledBy: string
  rollId: string
  timestamp: Date
  messageId: string
  deleted?: {
    userId: string
    timestamp: Date
  }
  channelId: string
  guildId: string
}
