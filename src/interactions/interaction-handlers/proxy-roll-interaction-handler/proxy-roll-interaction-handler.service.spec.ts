import { Test, TestingModule } from '@nestjs/testing'
import { ProxyRollInteractionHandlerService } from './proxy-roll-interaction-handler.service'

describe('ProxyRollInteractionHandlerService', () => {
  let service: ProxyRollInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyRollInteractionHandlerService],
    }).compile()

    service = module.get<ProxyRollInteractionHandlerService>(
      ProxyRollInteractionHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
