import { SlashCommandBuilder } from "discord.js";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start an event")
    .toJSON(),
  async run(interaction) {
    if (!eventSetups.has(interaction.user.id))
      return interaction.reply({
        content: "You don't have an event setup to start",
        ephemeral: true,
      });

    const event = eventSetups.get(interaction.user.id)!;

    event.start();

    eventSetups.delete(interaction.user.id);

    interaction.reply({
      content: "Started event",
      ephemeral: true,
    });
  },
});
