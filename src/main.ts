import { NestFactory } from '@nestjs/core'
import { Settings } from 'luxon'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { AppModule } from './app.module'

Settings.defaultZone = 'Asia/Manila'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  await app.listen(3000)
}
bootstrap()
