import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

interface CommandOptions {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  checks?: ((
    interaction: ChatInputCommandInteraction | AutocompleteInteraction,
  ) => boolean | Promise<boolean>)[];
  run: (interaction: ChatInputCommandInteraction) => Promise<any>;
  completion?: (interaction: AutocompleteInteraction) => Promise<any>;
  disabled?: boolean;
}

export class Command {
  constructor(options: CommandOptions) {
    this.data = options.data;

    this.checks = options.checks ?? [];

    this.run = options.run;
    this.completion = options.completion;

    this.disabled = options.disabled ?? false;
  }

  public readonly data;

  public readonly checks;

  public readonly run;
  public readonly completion?;

  public readonly disabled;
}
