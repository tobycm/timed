import Bot from "bot";
import { inlineCode } from "discord.js";
import { TriggerEvent } from "models/events";
import { IntervalTrigger } from "models/triggers";
import { checkInSetup } from "modules/checks/eventSetup";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";
import { secondsToTime } from "modules/utils";
import triggerCommand from "./trigger";

export default async (bot: Bot) => {
  if (!bot.commands.has("trigger")) bot.commands.set("trigger", new Map());

  (bot.commands.get("trigger") as Map<string, Command>).set(
    "interval",
    new Command({
      data: triggerCommand
        .addSubcommand((subcommand) =>
          subcommand
            .setName("interval")
            .setDescription("Add an interval trigger")
            .addNumberOption((option) => option.setName("interval").setDescription("Seconds").setAutocomplete(true).setRequired(true)),
        )
        .toJSON(),
      checks: [
        checkInSetup(TriggerEvent),
        async (interaction) => {
          const interval = interaction.options.getNumber("interval", true);

          if (interval > 0) return true;

          if (interaction.isCommand()) await interaction.reply({ content: "Interval must be a positive number", ephemeral: true });
          else interaction.respond([]);

          return false;
        },
      ],
      async completion(interaction) {
        const interval = interaction.options.getNumber("interval", true);

        interaction.respond([{ name: `Interval: ${secondsToTime(interval)}`, value: interval }]);
      },
      async run(interaction) {
        const interval = interaction.options.getNumber("interval", true);

        (eventSetups.get(interaction.user.id) as TriggerEvent).addTrigger(new IntervalTrigger(interval * 1000));

        interaction.reply({ content: `Added interval trigger ${inlineCode(secondsToTime(interval))}`, ephemeral: true });
      },
    }),
  );
};
