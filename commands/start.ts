import { SlashCommandBuilder } from "discord.js";
import { checkEventState } from "modules/checks/event";
import { Command } from "modules/command";
import { events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start an event")
    .addStringOption((option) => option.setName("event").setDescription("The name of the event to start").setRequired(true).setAutocomplete(true))
    .toJSON(),
  checks: [checkEventState(false)],
  async completion(interaction) {
    const eventNames: string[] = [];

    events.get(interaction.user.id)!.forEach((event, name) => {
      if (!event.running && event.name.startsWith(interaction.options.getString("event", true))) eventNames.push(name);
    });

    interaction.respond(eventNames.map((name) => ({ name, value: name })));
  },
  async run(interaction) {
    events.get(interaction.user.id)!.get(interaction.options.getString("event")!)!.start();

    interaction.reply({ content: "Started event", ephemeral: true });
  },
});

// fun fact: copilot wrote all of this in 30 seconds
