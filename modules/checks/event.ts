import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { events } from "modules/states";

export function checkHasEvents(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
  if (events.has(interaction.user.id)) return true;

  if (interaction.isAutocomplete()) interaction.respond([]);
  else interaction.reply({ content: "You don't have any events", ephemeral: true });

  return false;
}

export function checkEventState(targetState: boolean) {
  return (interaction: ChatInputCommandInteraction | AutocompleteInteraction) => {
    // post checkHasEvents

    if (interaction.isAutocomplete()) return true;
    const eventName = interaction.options.getString("event", true);

    if (events.get(interaction.user.id)!.get(eventName)?.running !== targetState) {
      interaction.reply({ content: `Event is already ${targetState ? "running" : "stopped"}`, ephemeral: true });
      return false;
    } else return true;
  };
}
