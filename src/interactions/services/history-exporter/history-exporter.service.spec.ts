import { Test, TestingModule } from '@nestjs/testing'
import { HistoryExporterService } from './history-exporter.service'

describe('HistoryExporterService', () => {
  let service: HistoryExporterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryExporterService],
    }).compile()

    service = module.get<HistoryExporterService>(HistoryExporterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
