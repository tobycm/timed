import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "modules/command";
import { events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop an event")
    .toJSON(),
  checks: [
    (interaction) => {
      interaction = interaction as ChatInputCommandInteraction; // no autocomplete
      const event = events.get(interaction.user.id);
      if (!event || !event.running) {
        interaction.reply({
          content: "You don't have an event that is running to stop",
          ephemeral: true,
        });
        return false;
      }
      return true;
    },
  ],
  async run(interaction) {
    const event = events.get(interaction.user.id)!;
    event.stop();

    interaction.reply({
      content: "Stopped event",
      ephemeral: true,
    });
  },
});
