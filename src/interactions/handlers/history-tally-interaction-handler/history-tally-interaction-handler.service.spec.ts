import { Test, TestingModule } from '@nestjs/testing'
import { HistoryTallyInteractionHandlerService } from './history-tally-interaction-handler.service'

describe('HistoryTallyInteractionHandlerService', () => {
  let service: HistoryTallyInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryTallyInteractionHandlerService],
    }).compile()

    service = module.get<HistoryTallyInteractionHandlerService>(
      HistoryTallyInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
