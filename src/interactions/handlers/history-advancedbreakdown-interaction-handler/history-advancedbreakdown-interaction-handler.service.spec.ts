import { Test, TestingModule } from '@nestjs/testing'
import { HistoryAdvancedbreakdownInteractionHandlerService } from './history-advancedbreakdown-interaction-handler.service'

describe('HistoryAdvancedbreakdownInteractionHandlerService', () => {
  let service: HistoryAdvancedbreakdownInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAdvancedbreakdownInteractionHandlerService],
    }).compile()

    service = module.get<HistoryAdvancedbreakdownInteractionHandlerService>(
      HistoryAdvancedbreakdownInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
