import { EventStoreDBClient } from '@eventstore/db-client'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Connection } from 'typeorm'
import { EntryDbEntity } from '../entities/entry.db-entity'

const COMMIT = 'COMMIT'

@Injectable()
export class CatchUpService implements OnApplicationBootstrap {
  constructor(private esdb: EventStoreDBClient, private typeorm: Connection) {}

  private async saveCommit(commit: bigint) {
    await this.typeorm.getRepository(EntryDbEntity).insert({
      value: commit.toString(),
      key: COMMIT,
    })
  }

  private async getCommit(): Promise<bigint | null> {
    const entry = await this.typeorm.getRepository(EntryDbEntity).findOne({
      where: {
        key: COMMIT,
      },
    })

    return entry ? BigInt(entry.value) : null
  }

  async onApplicationBootstrap() {
    const { esdb, typeorm } = this
    const commit = await this.getCommit()

    const stream = esdb.subscribeToAll({
      fromPosition: commit
        ? {
            commit,
            prepare: commit,
          }
        : 'start',
    })

    for await (const { commitPosition, event } of stream) {
      await this.saveCommit(commitPosition)

      if (event.streamId.startsWith('$') || !event.isJson) {
        continue
      }

      // TODO call reducer fn here
    }
  }
}
