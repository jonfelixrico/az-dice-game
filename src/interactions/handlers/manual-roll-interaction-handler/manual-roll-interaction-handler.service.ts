import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InteractionCreatedEvent } from 'src/interactions/services/interaction-events-relay/interaction-created.event'
import { RollEventHelperService } from 'src/interactions/services/roll-event-helper/roll-event-helper.service'

const ROLL_STRING_REGEX = /^[123456]{6}$/

@EventsHandler(InteractionCreatedEvent)
export class ManualRollInteractionHandlerService
  implements IEventHandler<InteractionCreatedEvent>
{
  constructor(private rollHelper: RollEventHelperService) {}

  async handle({ interaction }: InteractionCreatedEvent) {
    if (!interaction.isCommand() || interaction.commandName !== 'manualroll') {
      return
    }

    const { options } = interaction

    const rollOwner = options.getUser('user') ?? interaction.user
    const rawRollString = options.getString('rollstring')

    if (!ROLL_STRING_REGEX.test(rawRollString)) {
      await interaction.reply({
        ephemeral: true,
        content:
          'Please make sure that there are 6 characters in the string, and each character has a value between 1 and 6.',
      })
      return
    }

    const roll = rawRollString.split('').map((intVal) => parseInt(intVal))

    const response = await interaction.deferReply({ fetchReply: true })

    await this.rollHelper.createRoll({
      interaction,
      type: 'MANUAL',
      rollOwner,
      roll,
      messageId: response.id,
    })
  }
}
