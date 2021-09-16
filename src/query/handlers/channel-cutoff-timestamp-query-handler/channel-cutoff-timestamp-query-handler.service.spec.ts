import { Test, TestingModule } from '@nestjs/testing'
import { ChannelCutoffTimestampQueryHandlerService } from './channel-cutoff-timestamp-query-handler.service'

describe('ChannelCutoffTimestampQueryHandlerService', () => {
  let service: ChannelCutoffTimestampQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelCutoffTimestampQueryHandlerService],
    }).compile()

    service = module.get<ChannelCutoffTimestampQueryHandlerService>(
      ChannelCutoffTimestampQueryHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
