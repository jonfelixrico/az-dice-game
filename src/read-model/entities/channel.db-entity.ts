import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('channel')
export class ChannelDbEntity {
  @PrimaryColumn('varchar')
  channelId: string

  @Column('varchar')
  guildId: string

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  cutoffTimestamp: Date

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  setDt: Date

  @Column({
    type: 'varchar',
    nullable: true,
  })
  setBy: string

  @Column({
    type: 'bigint',
    transformer: {
      to: (val: bigint) => val,
      from: (val: bigint | string) => BigInt(val),
    },
  })
  revision: bigint
}
