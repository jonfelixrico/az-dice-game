import { PrizeTier } from 'src/utils/prize-eval'
import { RollType } from 'src/write-model/types/roll-created-event.interface'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('roll')
export class RollDbEntity {
  @PrimaryColumn('varchar')
  id: string

  @Column('varchar')
  rollId: string

  @Column('json')
  roll: number[]

  @Column('varchar')
  rolledBy: string

  @Column('varchar')
  rollOwner: string

  @Column('varchar')
  type: RollType

  @Column('timestamptz')
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
    type: 'timestamptz',
  })
  deleteDt: Date

  @Column({
    nullable: true,
  })
  prizeRank: PrizeTier

  /**
   * @deprecated
   */
  @Column({
    nullable: true,
  })
  prizeSubrank: number

  @Column({
    nullable: true,
  })
  prizePoints: number
}
