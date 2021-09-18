import { Test, TestingModule } from '@nestjs/testing'
import { SetCheckpointContextmenuHandlerService } from './set-checkpoint-contextmenu-handler.service'

describe('SetCheckpointContextmenuHandlerService', () => {
  let service: SetCheckpointContextmenuHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetCheckpointContextmenuHandlerService],
    }).compile()

    service = module.get<SetCheckpointContextmenuHandlerService>(
      SetCheckpointContextmenuHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
