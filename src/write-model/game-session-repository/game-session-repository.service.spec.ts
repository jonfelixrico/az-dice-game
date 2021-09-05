import { Test, TestingModule } from '@nestjs/testing'
import { GameSessionRepositoryService } from './game-session-repository.service'

describe('GameSessionRepositoryService', () => {
  let service: GameSessionRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSessionRepositoryService],
    }).compile()

    service = module.get<GameSessionRepositoryService>(
      GameSessionRepositoryService
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
