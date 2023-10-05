import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "modules/command";
import { events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start an event")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("The name of the event to start")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .toJSON(),
  checks: [
    (interaction) => {
      if (
        (() => {
          if (!events.has(interaction.user.id)) return false;

          if (interaction.isAutocomplete()) return true;

          const eventName = interaction.options.getString("event", true);

          if (events.get(interaction.user.id)!.get(eventName)?.running) return false;

          return true;
        })()
      )
        return true;
      else {
        if (interaction instanceof ChatInputCommandInteraction)
          interaction.reply({
            content: "You already have a running event",
            ephemeral: true,
          });
        else interaction.respond([]);
        return false;
      }
    },
  ],
  async completion(interaction) {
    const eventNames: string[] = [];

    events.get(interaction.user.id)!.forEach((event, name) => {
      if (!event.running && event.name.startsWith(interaction.options.getString("event", true)))
        eventNames.push(name);
    });

    interaction.respond(eventNames.map((name) => ({ name, value: name })));
  },
  async run(interaction) {
    events.get(interaction.user.id)!.get(interaction.options.getString("event")!)!.start();

    interaction.reply({
      content: "Started event",
      ephemeral: true,
    });
  },
});

// fun fact: copilot wrote all of this in 30 seconds
