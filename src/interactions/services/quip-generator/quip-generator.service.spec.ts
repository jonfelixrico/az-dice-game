import { Test, TestingModule } from '@nestjs/testing'
import { QuipGeneratorService } from './quip-generator.service'

describe('QuipGeneratorService', () => {
  let service: QuipGeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuipGeneratorService],
    }).compile()

    service = module.get<QuipGeneratorService>(QuipGeneratorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
