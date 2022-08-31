import { Test, TestingModule } from '@nestjs/testing'
import { HistoryBreakdownInteractionHandlerService } from './history-breakdown-interaction-handler.service'

describe('HistoryBreakdownInteractionHandlerService', () => {
  let service: HistoryBreakdownInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryBreakdownInteractionHandlerService],
    }).compile()

    service = module.get<HistoryBreakdownInteractionHandlerService>(
      HistoryBreakdownInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
