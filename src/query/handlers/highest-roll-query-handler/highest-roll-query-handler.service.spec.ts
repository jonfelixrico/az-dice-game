import { Test, TestingModule } from '@nestjs/testing'
import { HighestRollQueryHandlerService } from './highest-roll-query-handler.service'

describe('HighestRollQueryHandlerService', () => {
  let service: HighestRollQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighestRollQueryHandlerService],
    }).compile()

    service = module.get<HighestRollQueryHandlerService>(
      HighestRollQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
