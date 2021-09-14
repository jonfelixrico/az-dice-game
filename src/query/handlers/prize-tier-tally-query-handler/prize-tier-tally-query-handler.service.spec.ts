import { Test, TestingModule } from '@nestjs/testing'
import { PrizeTierTallyQueryHandlerService } from './prize-tier-tally-query-handler.service'

describe('PrizeTierTallyQueryHandlerService', () => {
  let service: PrizeTierTallyQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizeTierTallyQueryHandlerService],
    }).compile()

    service = module.get<PrizeTierTallyQueryHandlerService>(
      PrizeTierTallyQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
