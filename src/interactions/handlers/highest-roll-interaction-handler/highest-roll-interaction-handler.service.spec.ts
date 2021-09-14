import { Test, TestingModule } from '@nestjs/testing'
import { HighestRollInteractionHandlerService } from './highest-roll-interaction-handler.service'

describe('HighestRollInteractionHandlerService', () => {
  let service: HighestRollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HighestRollInteractionHandlerService],
    }).compile()

    service = module.get<HighestRollInteractionHandlerService>(
      HighestRollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
