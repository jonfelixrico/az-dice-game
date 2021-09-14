import { Test, TestingModule } from '@nestjs/testing'
import { RollEvaluatorService } from './roll-evaluator.service'

describe('RollEvaluatorService', () => {
  let service: RollEvaluatorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollEvaluatorService],
    }).compile()

    service = module.get<RollEvaluatorService>(RollEvaluatorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
