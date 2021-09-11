import { RollType } from 'src/write-model/types/roll-created-event.interface'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('roll')
export class RollDbEntity {
  @PrimaryColumn('varchar')
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

  @Column('varchar')
  deleteBy: string

  @Column('datetime')
  deleteDt: Date
}
