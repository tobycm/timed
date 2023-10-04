import { SlashCommandBuilder, inlineCode } from "discord.js";
import { TriggerEvent } from "models/events";
import { Command } from "modules/command";
import { setups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription("Create a new event")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of the event")
        .setRequired(true)
        .addChoices({ name: "Trigger", value: "trigger" })
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of the event")
        .setRequired(true)
    )
    .toJSON(),
  async run(interaction) {
    if (setups.has(interaction.user.id))
      return interaction.reply({
        content:
          "You must finish your current event setup before creating a new one",
        ephemeral: true,
      });

    const name = interaction.options.getString("name", true);
    const description = interaction.options.getString("description", true);

    const type = interaction.options.getString("type", true);

    if (type === "trigger")
      setups.set(interaction.user.id, new TriggerEvent({ name, description }));

    await interaction.reply({
      content:
        `Created new trigger event ${inlineCode(name)}\n` +
        `Please add triggers and results to this event`,
      ephemeral: true,
    });
  },
});
