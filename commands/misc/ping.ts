import { SlashCommandBuilder, inlineCode } from "discord.js";
import { Command } from "modules/command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Bot lag thế nhở")
    .toJSON(),
  async run(interaction) {
    interaction.reply(
      `Pong! ${inlineCode(String(interaction.client.ws.ping))}ms`
    );
  },
});
