import { Entity, PrimaryColumn } from 'typeorm'

@Entity('entry')
export class EntryDbEntity {
  @PrimaryColumn('varchar')
  key: string

  @PrimaryColumn()
  value: string
}
