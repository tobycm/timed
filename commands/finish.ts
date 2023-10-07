import { SlashCommandBuilder } from "discord.js";
import { Command } from "modules/command";
import { eventSetups, events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder().setName("finish").setDescription("Finish an event setup").toJSON(),
  async run(interaction) {
    if (!eventSetups.has(interaction.user.id))
      return interaction.reply({
        content: "You don't have an event setup to start",
        ephemeral: true,
      });

    const event = eventSetups.get(interaction.user.id)!;

    event.start();

    eventSetups.delete(interaction.user.id);

    if (!events.has(interaction.user.id)) events.set(interaction.user.id, new Map());
    events.get(interaction.user.id)!.set(event.name, event);

    interaction.reply({
      content: "Started event",
      ephemeral: true,
    });
  },
});
