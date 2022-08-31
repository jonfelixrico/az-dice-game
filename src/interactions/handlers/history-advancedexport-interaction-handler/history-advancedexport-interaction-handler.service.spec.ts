import { Test, TestingModule } from '@nestjs/testing'
import { HistoryAdvancedexportInteractionHandlerService } from './history-advancedexport-interaction-handler.service'

describe('HistoryAdvancedexportInteractionHandlerService', () => {
  let service: HistoryAdvancedexportInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAdvancedexportInteractionHandlerService],
    }).compile()

    service = module.get<HistoryAdvancedexportInteractionHandlerService>(
      HistoryAdvancedexportInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
