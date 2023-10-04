import { inlineCode } from "discord.js";
import { IntervalTrigger } from "models/triggers";
import { Command } from "modules/command";
import { setups } from "modules/states";
import { secondsToTime } from "modules/utils";
import triggerCommand from "./trigger";

export default new Command({
  data: triggerCommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("interval")
        .setDescription("Add an interval trigger")
        .addNumberOption((option) =>
          option
            .setName("interval")
            .setDescription("Seconds")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .toJSON(),
  async completion(interaction) {
    const { name, value } = interaction.options.getFocused(true);
    if (name !== "interval") return;

    const interval = Number(value);

    if (interval < 0) return;

    interaction.respond([
      {
        name: `Interval: ${secondsToTime(interval)}`,
        value: interval,
      },
    ]);
  },
  async run(interaction) {
    if (!setups.has(interaction.user.id))
      return interaction.reply({
        content: "You must setup an event before adding triggers",
        ephemeral: true,
      });

    const interval = interaction.options.getNumber("interval", true);

    if (interval < 0)
      return interaction.reply({
        content: "Interval must be a positive number",
        ephemeral: true,
      });

    setups
      .get(interaction.user.id)!
      .triggers.push(new IntervalTrigger(interval * 1000));

    interaction.reply({
      content: `Added interval trigger ${inlineCode(secondsToTime(interval))}`,
      ephemeral: true,
    });
  },
});
