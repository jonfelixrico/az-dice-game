import { Test, TestingModule } from '@nestjs/testing'
import { HistoryLastInteractionHandlerService } from './history-last-interaction-handler.service'

describe('HistoryLastInteractionHandlerService', () => {
  let service: HistoryLastInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryLastInteractionHandlerService],
    }).compile()

    service = module.get<HistoryLastInteractionHandlerService>(
      HistoryLastInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
