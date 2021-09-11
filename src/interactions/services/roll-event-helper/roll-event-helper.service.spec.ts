import { Test, TestingModule } from '@nestjs/testing'
import { RollEventHelperService } from './roll-event-helper.service'

describe('RollEventHelperService', () => {
  let service: RollEventHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollEventHelperService],
    }).compile()

    service = module.get<RollEventHelperService>(RollEventHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
