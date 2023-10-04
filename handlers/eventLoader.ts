import { readdirSync } from "fs";

import Bot from "bot";
import { ClientEvents } from "discord.js";
import Event from "modules/event";

const EVENT_DIR = "./events/"; // ko bỏ ./

export default async function loadEvents(bot: Bot) {
  readdirSync(EVENT_DIR).forEach(async (file) => {
    const clientEvent = (await import(`.${EVENT_DIR}${file}`)).default as Event<
      keyof ClientEvents
    >;
    if (clientEvent.disabled) return;
    (clientEvent.once ? bot.once : bot.on)(clientEvent.event, clientEvent.run);
  });
}
