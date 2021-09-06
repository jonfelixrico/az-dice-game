import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('roll')
export class RollDbEntity {
  @PrimaryColumn('varchar')
  rollId: string

  @Column('json')
  roll: number[]

  @Column('varchar')
  rollExecutor: string

  @Column('varchar')
  rollOwner: string

  @Column('varchar')
  type: string

  @Column('timestamp with time zone')
  timestamp: Date

  @Column('varchar')
  guildId: string

  @Column('varchar')
  deleteBy: string

  @Column('timestamp with time zone')
  deleteDt: Date
}
