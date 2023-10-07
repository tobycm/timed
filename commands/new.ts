import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import { TriggerEvent } from "models/events";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription("Create a new event")
    .addStringOption((option) =>
      option.setName("type").setDescription("The type of the event").setRequired(true).addChoices({ name: "Trigger", value: "trigger" }),
    )
    .addStringOption((option) => option.setName("name").setDescription("The name of the event").setRequired(true))
    .addStringOption((option) => option.setName("description").setDescription("The description of the event").setRequired(true))
    .toJSON(),
  checks: [
    (interaction) => {
      interaction = interaction as ChatInputCommandInteraction; // no autocomplete
      if (eventSetups.has(interaction.user.id)) {
        interaction.reply({ content: "You must finish your current event setup before creating a new one", ephemeral: true });
        return false;
      }
      return true;
    },
  ],
  async run(interaction) {
    const name = interaction.options.getString("name", true);
    const description = interaction.options.getString("description", true);

    const type = interaction.options.getString("type", true);

    switch (type) {
      case "trigger":
        eventSetups.set(interaction.user.id, new TriggerEvent({ name, description }));

        await interaction.reply({
          content: `Created new trigger event ${inlineCode(name)}\n` + `Please add triggers and results to this event`,
          ephemeral: true,
        });
      default:
        interaction.reply({ content: "Invalid event type", ephemeral: true });
        return;
    }
  },
});
