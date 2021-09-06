import { Test, TestingModule } from '@nestjs/testing'
import { ChannelWriteRepoService } from './channel-write-repo.service'

describe('ChannelWriteRepoService', () => {
  let service: ChannelWriteRepoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelWriteRepoService],
    }).compile()

    service = module.get<ChannelWriteRepoService>(ChannelWriteRepoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
