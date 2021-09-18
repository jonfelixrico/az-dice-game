import { Test, TestingModule } from '@nestjs/testing'
import { FindRollWithMessageIdQueryHandlerService } from './find-roll-with-message-id-query-handler.service'

describe('FindRollWithMessageIdQueryHandlerService', () => {
  let service: FindRollWithMessageIdQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindRollWithMessageIdQueryHandlerService],
    }).compile()

    service = module.get<FindRollWithMessageIdQueryHandlerService>(
      FindRollWithMessageIdQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
