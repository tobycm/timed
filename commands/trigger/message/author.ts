import { userMention } from "discord.js";
import { MessageAuthorTrigger } from "models/triggers";
import { checkInSetup } from "modules/checks/eventSetup";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";
import messageTriggerSubcommandGroup from "./message";

export default new Command({
  data: messageTriggerSubcommandGroup
    .addSubcommand((subcommand) =>
      subcommand
        .setName("author")
        .setDescription("Trigger when a user sends a message")
        .addUserOption((option) =>
          option.setName("user").setDescription("User").setRequired(true)
        )
    )
    .toJSON(),
  checks: [checkInSetup],
  async run(interaction) {
    const user = interaction.options.getUser("user", true);

    const trigger = new MessageAuthorTrigger(user);

    eventSetups.get(interaction.user.id)!.addTrigger(trigger);

    interaction.reply({
      content: `Added author trigger for ${userMention(user.id)}`,
      ephemeral: true,
    });
  },
});
