import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'discord.js'
import { REST } from '@discordjs/rest'
import { ROLL_COMMAND } from './builders/roll.command-builder'
import { Routes } from 'discord-api-types/v9'
import { FORCE_ROLL_COMMAND } from './builders/force-roll.command-builder'
import { PROXY_ROLL_COMMAND } from './builders/proxy-roll.command-builder'
import { MANUAL_ROLL_COMMAND } from './builders/manual-roll.command-builder'
import { CommandBuilderOutput } from './builders/builder.type'
import { HISTORY_SUBCOMMANDS } from './builders/history.subcommands'
import { REMOVE_ROLL_MESSAGE_COMMAND } from './builders/remove-roll.message-command'
import { MessageCommand } from './builders/message-command.type'
import { SET_CHECKPOINT_MESSAGE_COMMAND } from './builders/set-checkpoint.message-command'

const COMMAND_BUILDERS: Array<CommandBuilderOutput | MessageCommand> = [
  ROLL_COMMAND,
  FORCE_ROLL_COMMAND,
  PROXY_ROLL_COMMAND,
  MANUAL_ROLL_COMMAND,
  HISTORY_SUBCOMMANDS,
  REMOVE_ROLL_MESSAGE_COMMAND,
  SET_CHECKPOINT_MESSAGE_COMMAND,
]

@Injectable()
export class CommandRegistrationService implements OnApplicationBootstrap {
  constructor(private client: Client, private config: ConfigService) {}

  get registrationRoutes(): `/${string}`[] {
    const { client, config } = this
    const commandGuildIdEnvVar: string = config.get('COMMAND_GUILD_ID') ?? ''

    if (commandGuildIdEnvVar) {
      return commandGuildIdEnvVar
        .split(',')
        .map((str) => str.trim())
        .map((guildId) =>
          Routes.applicationGuildCommands(client.application.id, guildId)
        )
    }

    return [Routes.applicationCommands(client.application.id)]
  }

  async onApplicationBootstrap() {
    const { client, registrationRoutes } = this
    const rest = new REST({ version: '9' }).setToken(client.token)

    for (const route of registrationRoutes) {
      await rest.put(route, {
        body: COMMAND_BUILDERS.map((command) => command),
      })
    }
  }
}
