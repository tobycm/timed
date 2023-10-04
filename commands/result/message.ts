import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { checkInSetup } from "modules/checks/eventSetup";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";
import resultCommand from "./result";

export default new Command({
  data: resultCommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Send a message to a channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the message")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .toJSON(),
  checks: [checkInSetup],
  async run(interaction) {
    const channel = interaction.options.getChannel("channel", true, [
      ChannelType.GuildText,
    ]);

    const modal = new ModalBuilder()
      .setCustomId("modal")
      .setTitle("Message content")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Message content")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
        )
      );

    await interaction.showModal(modal);
    const modalResult = await interaction.awaitModalSubmit({
      time: 1000 * 60 * 30,
    });

    eventSetups
      .get(interaction.user.id)!
      .results.push(() =>
        channel.send(modalResult.fields.getTextInputValue("content"))
      );

    modalResult.reply({
      content: "Message will be sent when the event is triggered.",
      ephemeral: true,
    });
  },
});
