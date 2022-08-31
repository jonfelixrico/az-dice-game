import { Test, TestingModule } from '@nestjs/testing'
import { RollHistoryQueryHandlerService } from './roll-history-query-handler.service'

describe('RollHistoryQueryHandlerService', () => {
  let service: RollHistoryQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollHistoryQueryHandlerService],
    }).compile()

    service = module.get<RollHistoryQueryHandlerService>(
      RollHistoryQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
