import { Test, TestingModule } from '@nestjs/testing'
import { HistoryHighestInteractionHandlerService } from './history-highest-interaction-handler.service'

describe('HistoryHighestInteractionHandlerService', () => {
  let service: HistoryHighestInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryHighestInteractionHandlerService],
    }).compile()

    service = module.get<HistoryHighestInteractionHandlerService>(
      HistoryHighestInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
