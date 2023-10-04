import { SlashCommandBuilder } from "discord.js";
import { Command } from "modules/command";
import { setups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancel the current event")
    .toJSON(),
  async run(interaction) {
    if (!setups.has(interaction.user.id))
      return interaction.reply({
        content: "You don't have an event setup to cancel",
        ephemeral: true,
      });

    setups.delete(interaction.user.id);

    interaction.reply({
      content: "Cancelled current event setup",
      ephemeral: true,
    });
  },
});
