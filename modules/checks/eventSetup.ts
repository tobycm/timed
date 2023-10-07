import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { Event } from "models/events";
import { eventSetups } from "modules/states";

export function checkInSetup(eventType: typeof Event) {
  return (interaction: ChatInputCommandInteraction | AutocompleteInteraction) => {
    if (eventSetups.get(interaction.user.id) instanceof eventType) return true;

    if (interaction.isCommand()) interaction.reply({ content: "You must start an event setup first before performing this action", ephemeral: true });
    else interaction.respond([]);

    return false;
  };
}
