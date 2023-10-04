import { Events, Message } from "discord.js";
import Event from "modules/event";

export const messageTriggers = new Map<string, (message: Message) => any>();

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    messageTriggers.forEach((trigger) => trigger(message));
  },
});
