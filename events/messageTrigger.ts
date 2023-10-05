import { Events, Message } from "discord.js";
import Event from "modules/event";

export const messageTriggers = new Map<
  string,
  (message: Message<true>) => any
>();

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    messageTriggers.forEach((trigger) => trigger(message));
  },
});
