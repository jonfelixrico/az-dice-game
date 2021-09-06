import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('channel')
export class ChannelDbEntity {
  @PrimaryColumn('varchar')
  channelId: string

  @Column('varchar')
  rollId: string
}
