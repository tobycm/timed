import { lstatSync, readdirSync } from "fs";

import Bot from "bot";
import { Command } from "modules/command";

const COMMANDS_FOLDER = "./commands/";

export default async function loadCommands(bot: Bot) {
  async function loadCommand(root: string, item: string): Promise<any> {
    if (lstatSync(root + item).isDirectory()) {
      const newRoot = root + item + "/";

      for (const item of readdirSync(newRoot)) await loadCommand(newRoot, item);
      return;
    }

    if (!item.endsWith(".ts")) return;

    const command = (await import(`.${root}${item}`)).default;

    if (command instanceof Command) return bot.commands.set(command.data.name, command);
  }

  for (const item of readdirSync(COMMANDS_FOLDER)) await loadCommand(COMMANDS_FOLDER, item);
}
