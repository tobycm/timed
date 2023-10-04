import { Events } from "discord.js";
import { Command } from "modules/command";
import Event from "modules/event";

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    if (!message.client.owners.includes(message.author.id)) return;

    if (!message.mentions.has(message.client.user)) return;

    if (message.content.endsWith("deploy")) {
      const commands: (typeof Command.prototype.data)[] = [];
      message.client.commands.forEach((command) => commands.push(command.data));
      message.client.application?.commands.set(commands);

      return message.reply("Đã deploy slash commands");
    }

    return message.reply("hi :3");
  },
});
