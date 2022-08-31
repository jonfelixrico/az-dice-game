import { Test, TestingModule } from '@nestjs/testing'
import { HistoryRemovelastrollInteractionHandlerService } from './history-removelastroll-interaction-handler.service'

describe('HistoryRemovelastrollInteractionHandlerService', () => {
  let service: HistoryRemovelastrollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryRemovelastrollInteractionHandlerService],
    }).compile()

    service = module.get<HistoryRemovelastrollInteractionHandlerService>(
      HistoryRemovelastrollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
