import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { eventSetups } from "modules/states";

export function checkInSetup(
  interaction: ChatInputCommandInteraction | AutocompleteInteraction
) {
  if (eventSetups.has(interaction.user.id)) return true;

  if (interaction.isCommand())
    interaction.reply({
      content:
        "You must start an event setup first before performing this action",
      ephemeral: true,
    });
  else interaction.respond([]);
  return false;
}
