import { Test, TestingModule } from '@nestjs/testing'
import { PrizeTallyInteractionHandlerService } from './prize-tally-interaction-handler.service'

describe('PrizeTallyInteractionHandlerService', () => {
  let service: PrizeTallyInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizeTallyInteractionHandlerService],
    }).compile()

    service = module.get<PrizeTallyInteractionHandlerService>(
      PrizeTallyInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
