import Bot from "bot";
import { SlashCommandBuilder, inlineCode } from "discord.js";
import { Command } from "modules/command";

export default async (bot: Bot) => {
  bot.commands.set(
    "ping",
    new Command({
      data: new SlashCommandBuilder().setName("ping").setDescription("Bot lag thế nhở").toJSON(),
      async run(interaction) {
        interaction.reply(`Pong! ${inlineCode(`${interaction.client.ws.ping}`)}ms`);
      },
    }),
  );
};
