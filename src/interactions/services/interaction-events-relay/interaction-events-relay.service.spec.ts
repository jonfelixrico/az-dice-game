import { Test, TestingModule } from '@nestjs/testing'
import { InteractionEventsRelayService } from './interaction-events-relay.service'

describe('InteractionEventsRelayService', () => {
  let service: InteractionEventsRelayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionEventsRelayService],
    }).compile()

    service = module.get<InteractionEventsRelayService>(
      InteractionEventsRelayService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
