import { Test, TestingModule } from '@nestjs/testing'
import { RollBreakdownQueryHandlerService } from './roll-breakdown-query-handler.service'

describe('RollBreakdownQueryHandlerService', () => {
  let service: RollBreakdownQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollBreakdownQueryHandlerService],
    }).compile()

    service = module.get<RollBreakdownQueryHandlerService>(
      RollBreakdownQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
