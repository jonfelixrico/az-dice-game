import { IBaseEvent, IBaseEventPayload } from './base-event.interface'

export interface IChannelCutoffTimestampSetEventPayload
  extends IBaseEventPayload {
  userId: string
  cutoffTimestamp: Date
}

export interface IChannelCutoffTimestampSetEvent
  extends IBaseEvent<IChannelCutoffTimestampSetEventPayload> {
  type: 'CHANNEL_CUTOFF_TIMESTAMP_SET'
}
