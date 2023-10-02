import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

export function checkNSFW(
  interaction: ChatInputCommandInteraction | AutocompleteInteraction
) {
  if (!interaction.channel) return false;
  if (!("nsfw" in interaction.channel)) return false; // bủh

  const nsfw = interaction.channel.nsfw;

  if (!nsfw) {
    if (interaction instanceof AutocompleteInteraction)
      interaction.respond([
        {
          name: "Đi qua cái channel nsfw sú sú kia rồi mới dùng lệnh này nhé :>",
          value: "nsfw",
        },
      ]);
    else
      interaction.reply(
        "Đi qua cái channel nsfw sú sú kia rồi mới dùng lệnh này nhé :>"
      );
  }

  return nsfw;
}
