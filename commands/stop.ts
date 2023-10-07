import { SlashCommandBuilder } from "discord.js";
import { checkEventState } from "modules/checks/event";
import { Command } from "modules/command";
import { events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop an event")
    .addStringOption((option) => option.setName("event").setDescription("The name of the event to stop").setRequired(true).setAutocomplete(true))
    .toJSON(),
  checks: [checkEventState(true)],
  async completion(interaction) {
    const eventNames: string[] = [];

    events.get(interaction.user.id)!.forEach((event, name) => {
      if (event.running && event.name.startsWith(interaction.options.getString("event", true))) eventNames.push(name);
    });

    interaction.respond(eventNames.map((name) => ({ name, value: name })));
  },
  async run(interaction) {
    events.get(interaction.user.id)!.get(interaction.options.getString("event")!)!.stop();

    interaction.reply({ content: "Stopped event", ephemeral: true });
  },
});
