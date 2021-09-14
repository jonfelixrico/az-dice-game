import { Test, TestingModule } from '@nestjs/testing'
import { HighestWinningRollQueryHandlerService } from './highest-winning-roll-query-handler.service'

describe('HighestWinningRollQueryHandlerService', () => {
  let service: HighestWinningRollQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighestWinningRollQueryHandlerService],
    }).compile()

    service = module.get<HighestWinningRollQueryHandlerService>(
      HighestWinningRollQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
