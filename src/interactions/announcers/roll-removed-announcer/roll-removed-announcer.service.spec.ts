import { Test, TestingModule } from '@nestjs/testing'
import { RollRemovedAnnouncerService } from './roll-removed-announcer.service'

describe('RollRemovedAnnouncerService', () => {
  let service: RollRemovedAnnouncerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollRemovedAnnouncerService],
    }).compile()

    service = module.get<RollRemovedAnnouncerService>(
      RollRemovedAnnouncerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
