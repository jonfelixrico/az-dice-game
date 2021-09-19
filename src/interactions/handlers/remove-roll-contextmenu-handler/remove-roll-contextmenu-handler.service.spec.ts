import { Test, TestingModule } from '@nestjs/testing'
import { RemoveRollContextmenuHandlerService } from './remove-roll-contextmenu-handler.service'

describe('RemoveRollContextmenuHandlerService', () => {
  let service: RemoveRollContextmenuHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveRollContextmenuHandlerService],
    }).compile()

    service = module.get<RemoveRollContextmenuHandlerService>(
      RemoveRollContextmenuHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
