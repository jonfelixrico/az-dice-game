import { Test, TestingModule } from '@nestjs/testing'
import { AdvancedBreakdownReloadButtonHandlerService } from './advanced-breakdown-reload-button-handler.service'

describe('AdvancedBreakdownReloadButtonHandlerService', () => {
  let service: AdvancedBreakdownReloadButtonHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvancedBreakdownReloadButtonHandlerService],
    }).compile()

    service = module.get<AdvancedBreakdownReloadButtonHandlerService>(
      AdvancedBreakdownReloadButtonHandlerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
