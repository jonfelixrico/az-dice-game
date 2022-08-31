export interface ChannelCutoffTimestampQueryInput {
  channelId: string
  guildId: string

  // if there's no record for the specified channel, then we'll use the default date of January 1, 1970 instead
  useOriginDateIfNotFound?: boolean
}

export type ChannelCutoffTimestampQueryOutput = Date | null

/**
 * This query is expected to return a date that represents the "cutoff timestamp" of a channel.
 * TODO explain purpose of the cutoff timestamp
 */
export class ChannelCutoffTimestampQuery {
  constructor(readonly input: ChannelCutoffTimestampQueryInput) {}
}
