import { Provider } from '@nestjs/common'
import { Connection, createConnection } from 'typeorm'

export const typeormProviders: Provider[] = [
  {
    provide: Connection,
    useFactory: () =>
      createConnection({
        type: 'sqlite',
        database: 'az-dice',
      }),
  },
]
