import { Test, TestingModule } from '@nestjs/testing'
import { HistoryRemoverollInteractionHandlerService } from './history-removeroll-interaction-handler.service'

describe('HistoryRemoverollInteractionHandlerService', () => {
  let service: HistoryRemoverollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryRemoverollInteractionHandlerService],
    }).compile()

    service = module.get<HistoryRemoverollInteractionHandlerService>(
      HistoryRemoverollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
