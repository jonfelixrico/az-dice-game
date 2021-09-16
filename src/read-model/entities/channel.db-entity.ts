import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('channel')
export class ChannelDbEntity {
  @PrimaryColumn('varchar')
  channelId: string

  @Column('varchar')
  guildId: string

  @Column()
  cutoffTimestamp: Date

  @Column()
  setDt: Date

  @Column()
  setBy: string
}
