import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('entry')
export class EntryDbEntity {
  @PrimaryColumn('varchar')
  key: string

  @Column()
  value: string
}
