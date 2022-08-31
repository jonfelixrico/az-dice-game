import { Test, TestingModule } from '@nestjs/testing'
import { HistoryClearInteractionHandlerService } from './history-clear-interaction-handler.service'

describe('HistoryClearInteractionHandlerService', () => {
  let service: HistoryClearInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryClearInteractionHandlerService],
    }).compile()

    service = module.get<HistoryClearInteractionHandlerService>(
      HistoryClearInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
