import { Test, TestingModule } from '@nestjs/testing'
import { RollPresentationSerializerService } from './roll-presentation-serializer.service'

describe('RollPresentationSerializerService', () => {
  let service: RollPresentationSerializerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RollPresentationSerializerService],
    }).compile()

    service = module.get<RollPresentationSerializerService>(
      RollPresentationSerializerService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
