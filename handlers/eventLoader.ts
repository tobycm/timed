import { readdirSync } from "fs";

import Bot from "bot";
import Event from "modules/event";

const EVENT_DIR = "./events/"; // ko bỏ ./

export default async function loadEvents(bot: Bot) {
  readdirSync(EVENT_DIR).forEach(async (file) => {
    const event = (await import(`.${EVENT_DIR}${file}`)).default;

    if (!(event instanceof Event)) return;
    if (event.disabled) return;

    if (event.once) bot.once(event.event, event.run);
    else bot.on(event.event, event.run);
  });
}
