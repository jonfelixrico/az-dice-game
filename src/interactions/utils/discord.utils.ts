export interface MessageInfo {
  messageId: string
  guildId: string
  channelId: string
}

/**
 * Generates a Discord URL that points to the provided message
 * @param param0
 * @returns
 */
export function getMessageLink({ messageId, guildId, channelId }: MessageInfo) {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`
}
