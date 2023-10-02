import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  inlineCode,
} from "discord.js";
import { Command } from "modules/command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Bot lag thế nhở"),
  async run(interaction: ChatInputCommandInteraction) {
    interaction.reply(
      `Pong! ${inlineCode(String(interaction.client.ws.ping))}ms`
    );
  },
});
