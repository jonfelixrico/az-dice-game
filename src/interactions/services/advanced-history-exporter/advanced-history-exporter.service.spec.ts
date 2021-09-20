import { Test, TestingModule } from '@nestjs/testing'
import { AdvancedHistoryExporterService } from './advanced-history-exporter.service'

describe('AdvancedHistoryExporterService', () => {
  let service: AdvancedHistoryExporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvancedHistoryExporterService],
    }).compile()

    service = module.get<AdvancedHistoryExporterService>(
      AdvancedHistoryExporterService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
