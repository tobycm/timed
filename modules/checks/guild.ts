import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

export function guildOnly(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
  if (interaction.inGuild()) return true;

  if (interaction instanceof AutocompleteInteraction) interaction.respond([]);
  else interaction.reply("Lệnh này chỉ có thể chạy trong server thôi nhé :>");

  return false;
}
