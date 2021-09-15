import { RollType } from 'src/write-model/types/roll-created-event.interface'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('roll')
export class RollDbEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  rollId: string

  @Column({
    type: 'text',
    transformer: {
      to: (roll: number[]) => JSON.stringify(roll),
      from: (rollString: string) => JSON.parse(rollString),
    },
  })
  roll: number[]

  @Column('varchar')
  rolledBy: string

  @Column('varchar')
  rollOwner: string

  @Column('varchar')
  type: RollType

  @Column('datetime')
  timestamp: Date

  @Column('varchar')
  guildId: string

  @Column('varchar')
  channelId: string

  @Column({
    type: 'varchar',
    nullable: true,
  })
  messageId: string

  @Column({
    nullable: true,
    type: 'varchar',
  })
  deleteBy: string

  @Column({
    nullable: true,
    type: 'datetime',
  })
  deleteDt: Date

  @Column({
    nullable: true,
  })
  prizeRank: number

  @Column({
    nullable: true,
  })
  prizeSubrank: number
}
