import { lstatSync, readdirSync } from "fs";

import Bot from "bot";
import { Command } from "modules/command";

const COMMANDS_FOLDER = "./commands/";

export default async function loadCommands(bot: Bot) {
  async function loadCommand(root: string, item: string): Promise<any> {
    if (lstatSync(root + item).isDirectory()) {
      const newRoot = root + item + "/";
      return readdirSync(newRoot).forEach(async (item) =>
        loadCommand(newRoot, item)
      );
    }
    const command = (await import(`.${root}${item}`)).default as Command;
    return bot.commands.set(command.data.name, command);
  }

  readdirSync(COMMANDS_FOLDER).forEach(async (item) =>
    loadCommand(COMMANDS_FOLDER, item)
  );
}
