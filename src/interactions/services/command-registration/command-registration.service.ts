import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'discord.js'
import { REST } from '@discordjs/rest'
import { ROLL_COMMAND } from './builders/roll.command-builder'
import { Routes } from 'discord-api-types/v9'
import { FORCE_ROLL_COMMAND } from './builders/force-roll.command-builder'
import { PROXY_ROLL_COMMAND } from './builders/proxy-roll.command-builder'
import { MANUAL_ROLL_COMMAND } from './builders/manual-roll.command-builder'
import { PRIZE_TALLY_COMMAND } from './builders/prize-tally-command-builder'
import { HIGHEST_ROLL_COMMAND } from './builders/highest-roll.command-builder'
import { REMOVE_ROLL_COMMAND } from './builders/remove-roll.command-builder'
import { CommandBuilderOutput } from './builders/builder.type'
import { HISTORY_SUBCOMMANDS } from './builders/history.subcommands'

const COMMAND_BUILDERS: CommandBuilderOutput[] = [
  ROLL_COMMAND,
  FORCE_ROLL_COMMAND,
  PROXY_ROLL_COMMAND,
  MANUAL_ROLL_COMMAND,
  PRIZE_TALLY_COMMAND,
  HIGHEST_ROLL_COMMAND,
  REMOVE_ROLL_COMMAND,
  HISTORY_SUBCOMMANDS,
]

@Injectable()
export class CommandRegistrationService implements OnApplicationBootstrap {
  constructor(private client: Client, private config: ConfigService) {}

  get registrationRoute(): `/${string}` {
    const { client, config } = this
    const commandGuildId: string = config.get('COMMAND_GUILD_ID')

    if (commandGuildId) {
      return Routes.applicationGuildCommands(
        client.application.id,
        commandGuildId
      )
    }

    return Routes.applicationCommands(client.application.id)
  }

  async onApplicationBootstrap() {
    const { client, registrationRoute } = this
    const rest = new REST({ version: '9' }).setToken(client.token)

    await rest.put(registrationRoute, {
      body: COMMAND_BUILDERS.map((command) => command),
    })
  }
}
