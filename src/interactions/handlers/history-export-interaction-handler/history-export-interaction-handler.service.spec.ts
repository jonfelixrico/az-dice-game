import { Test, TestingModule } from '@nestjs/testing'
import { HistoryExportInteractionHandlerService } from './history-export-interaction-handler.service'

describe('HistoryExportInteractionHandlerService', () => {
  let service: HistoryExportInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryExportInteractionHandlerService],
    }).compile()

    service = module.get<HistoryExportInteractionHandlerService>(
      HistoryExportInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
