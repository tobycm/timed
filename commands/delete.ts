import { ChatInputCommandInteraction, SlashCommandBuilder, chatInputApplicationCommandMention } from "discord.js";
import { Command } from "modules/command";
import { events } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete an event")
    .addStringOption((option) => option.setName("event").setDescription("The name of the event to delete").setRequired(true).setAutocomplete(true))
    .addBooleanOption((option) => option.setName("force").setDescription("Force delete the event").setRequired(false))
    .toJSON(),
  checks: [
    (interaction) => {
      if (
        (() => {
          if (!events.has(interaction.user.id)) return false;

          if (interaction.isAutocomplete()) return true;

          if (
            events.get(interaction.user.id)!.get(interaction.options.getString("event", true))?.running &&
            !interaction.options.getBoolean("force", false)
          )
            return false;

          return true;
        })()
      )
        return true;
      else {
        if (interaction instanceof ChatInputCommandInteraction)
          interaction.reply({
            content: `Can't delete this event. Try using ${chatInputApplicationCommandMention(
              "stop",
              interaction.client.application.commands.cache.get("stop")?.id ?? "", // wow
            )} first`,
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
      if (
        (!event.running || (event.running && interaction.options.getBoolean("force"))) &&
        event.name.startsWith(interaction.options.getString("event", true))
      )
        eventNames.push(name);
    });

    interaction.respond(eventNames.map((name) => ({ name, value: name })));
  },
  async run(interaction) {
    events.get(interaction.user.id)!.get(interaction.options.getString("event")!)!.start();

    interaction.reply({
      content: "Deleted event",
      ephemeral: true,
    });
  },
});
