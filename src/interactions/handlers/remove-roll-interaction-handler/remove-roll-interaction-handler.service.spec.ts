import { Test, TestingModule } from '@nestjs/testing'
import { RemoveRollInteractionHandlerService } from './remove-roll-interaction-handler.service'

describe('RemoveRollInteractionHandlerService', () => {
  let service: RemoveRollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveRollInteractionHandlerService],
    }).compile()

    service = module.get<RemoveRollInteractionHandlerService>(
      RemoveRollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
