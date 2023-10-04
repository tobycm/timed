import { SlashCommandBuilder } from "discord.js";
import { checkInSetup } from "modules/checks/eventSetup";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancel the current event")
    .toJSON(),
  checks: [checkInSetup],
  async run(interaction) {
    eventSetups.delete(interaction.user.id);

    interaction.reply({
      content: "Cancelled current event setup",
      ephemeral: true,
    });
  },
});
