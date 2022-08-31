import { Test, TestingModule } from '@nestjs/testing'
import { RollFormatterService } from './roll-formatter.service'

describe('RollFormatterService', () => {
  let service: RollFormatterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollFormatterService],
    }).compile()

    service = module.get<RollFormatterService>(RollFormatterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
