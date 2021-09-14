import { Test, TestingModule } from '@nestjs/testing'
import { RollAnnouncerService } from './roll-announcer.service'

describe('RollAnnouncerService', () => {
  let service: RollAnnouncerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollAnnouncerService],
    }).compile()

    service = module.get<RollAnnouncerService>(RollAnnouncerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
