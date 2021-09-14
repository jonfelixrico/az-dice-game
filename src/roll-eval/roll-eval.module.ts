import { Module } from '@nestjs/common'
import { RollEvaluatorService } from './roll-evaluator/roll-evaluator.service'

@Module({
  providers: [RollEvaluatorService],
})
export class RollEvalModule {}
