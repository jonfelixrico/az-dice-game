import { Test, TestingModule } from '@nestjs/testing'
import { RollInteractionHandlerService } from './roll-interaction-handler.service'

describe('RollInteractionHandlerService', () => {
  let service: RollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollInteractionHandlerService],
    }).compile()

    service = module.get<RollInteractionHandlerService>(
      RollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
