import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  ChannelCutoffTimestampQuery,
  ChannelCutoffTimestampQueryOutput,
} from 'src/query/channel-cutoff-timestamp.query'
import { ChannelDbEntity } from 'src/read-model/entities/channel.db-entity'
import { Connection } from 'typeorm'

@QueryHandler(ChannelCutoffTimestampQuery)
export class ChannelCutoffTimestampQueryHandlerService
  implements IQueryHandler<ChannelCutoffTimestampQuery>
{
  constructor(private typeorm: Connection) {}

  async execute({
    input,
  }: ChannelCutoffTimestampQuery): Promise<ChannelCutoffTimestampQueryOutput> {
    const { useOriginDateIfNotFound, ...channelDetails } = input
    const channelRecord = await this.typeorm
      .getRepository(ChannelDbEntity)
      .findOne(channelDetails)

    if (!channelRecord || !channelRecord.cutoffTimestamp) {
      // returns January 1, 1970 if `userOriginDateIfNotFound` is truthy
      return useOriginDateIfNotFound ? new Date(0) : null
    }

    return channelRecord.cutoffTimestamp
  }
}
