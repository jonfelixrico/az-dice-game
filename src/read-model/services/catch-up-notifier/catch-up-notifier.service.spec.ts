import { Test, TestingModule } from '@nestjs/testing'
import { CatchUpNotifierService } from './catch-up-notifier.service'

describe('CatchUpNotifierService', () => {
  let service: CatchUpNotifierService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatchUpNotifierService],
    }).compile()

    service = module.get<CatchUpNotifierService>(CatchUpNotifierService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
