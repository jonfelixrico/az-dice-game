import { Test, TestingModule } from '@nestjs/testing'
import { ManualRollInteractionHandlerService } from './manual-roll-interaction-handler.service'

describe('ManualRollInteractionHandlerService', () => {
  let service: ManualRollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManualRollInteractionHandlerService],
    }).compile()

    service = module.get<ManualRollInteractionHandlerService>(
      ManualRollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
