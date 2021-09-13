import { Test, TestingModule } from '@nestjs/testing'
import { ForceRollInteractionHandlerService } from './force-roll-interaction-handler.service'

describe('ForceRollInteractionHandlerService', () => {
  let service: ForceRollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForceRollInteractionHandlerService],
    }).compile()

    service = module.get<ForceRollInteractionHandlerService>(
      ForceRollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
