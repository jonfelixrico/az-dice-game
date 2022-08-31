import { Test, TestingModule } from '@nestjs/testing'
import { LastRollQueryHandlerService } from './last-roll-query-handler.service'

describe('LastRollQueryHandlerService', () => {
  let service: LastRollQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastRollQueryHandlerService],
    }).compile()

    service = module.get<LastRollQueryHandlerService>(
      LastRollQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
