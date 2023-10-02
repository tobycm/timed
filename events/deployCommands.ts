import { Events, SlashCommandBuilder } from "discord.js";
import Event from "modules/event";

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    if (!message.client.owners.includes(message.author.id)) return;

    if (message.content !== "deploy") return;

    const commands: SlashCommandBuilder[] = [];
    message.client.commands.forEach((command) => commands.push(command.data));
    message.client.application?.commands.set(commands);

    message.reply("Đã deploy slash commands");
  },
});
