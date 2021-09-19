import { Test, TestingModule } from '@nestjs/testing'
import { FindRollByIdQueryHandlerService } from './find-roll-by-id-query-handler.service'

describe('FindRollByIdQueryHandlerService', () => {
  let service: FindRollByIdQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindRollByIdQueryHandlerService],
    }).compile()

    service = module.get<FindRollByIdQueryHandlerService>(
      FindRollByIdQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
