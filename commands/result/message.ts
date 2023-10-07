import Bot from "bot";
import { ActionRowBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { TriggerEvent } from "models/events";
import { checkInSetup } from "modules/checks/eventSetup";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";
import resultCommand from "./result";

export default async (bot: Bot) => {
  if (!bot.commands.has("result")) bot.commands.set("result", new Map());

  (bot.commands.get("result") as Map<string, Command>).set(
    "message",
    new Command({
      data: resultCommand
        .setName("message")
        .setDescription("Send a message to a channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Channel to send the message").setRequired(true).addChannelTypes(ChannelType.GuildText),
        )
        .toJSON(),
      checks: [checkInSetup(TriggerEvent)],
      async run(interaction) {
        const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);

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
                .setMinLength(1),
            ),
          );

        await interaction.showModal(modal);
        const modalResult = await interaction.awaitModalSubmit({ time: 1000 * 60 * 30 });

        eventSetups.get(interaction.user.id)!.addOutput(() => channel.send(modalResult.fields.getTextInputValue("content")));

        modalResult.reply({ content: "Message will be sent when the event is triggered.", ephemeral: true });
      },
    }),
  );
};
