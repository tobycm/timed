import { readFileSync } from "fs";

import {
  Client,
  ClientOptions,
  EmbedBuilder,
  GatewayIntentBits,
  Snowflake,
  codeBlock,
} from "discord.js";

import { QuickDB } from "quick.db";

export interface Config {
  bot: {
    token: string;
    owners: Snowflake[];
    channels: {
      error: Snowflake;
    };
  };
}

import config from "config";

import loadCommands from "handlers/commandLoader";
import database from "handlers/databaseLoader";
import loadEvents from "handlers/eventLoader";

import { Command } from "modules/command";

const package_json = JSON.parse(readFileSync("./package.json", "utf-8"));

declare module "discord.js" {
  interface Client {
    version: string;
    owners: Snowflake[];
    commands: Map<string, Command>;
    db: QuickDB;

    reportError(error: Error): Promise<void>;
  }
}

interface Options extends ClientOptions {
  version: string;
  owners?: string[];
}

export default class Bot extends Client {
  constructor(options: Options) {
    super(options);

    this.version = options.version;
    this.owners = options.owners || [];
    this.commands = new Map();
    this.db = database;

    loadEvents(this);
    loadCommands(this);
  }

  public readonly version: string;
  public readonly owners: Snowflake[];
  public readonly commands: Map<string, Command>;
  public readonly db: QuickDB;

  public async reportError(error: Error): Promise<void> {
    console.log(error); // log ổn hơn
    const channel = await this.channels.fetch(config.bot.channels.error);
    if (!channel?.isTextBased()) return;

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("An error has occurred!")
          .setDescription(codeBlock("js", error.stack || error.message))
          .setColor("Random"),
      ],
    });
  }
}

const folody = new Bot({
  intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
  version: package_json.version,
  owners: config.bot.owners,
});

folody.login(config.bot.token);
