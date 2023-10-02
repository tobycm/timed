import { Events } from "discord.js";
import Event from "modules/event";
import { UserError } from "modules/exceptions/base";

export default new Event({
  event: Events.InteractionCreate,
  async run(interaction) {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
      return;

    if (interaction.user.bot) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.disabled) {
      if (interaction.isAutocomplete())
        return interaction.respond([
          {
            name: "Lệnh này đã bị tắt",
            value: "Lệnh này đã bị tắt",
          },
        ]);

      return interaction.reply("Lệnh này đã bị tắt");
    }

    if (interaction.isAutocomplete()) {
      if (!command.completion) return;

      for (const check of command.checks) {
        try {
          const ok = await check(interaction);
          if (!ok) return;
        } catch (error) {
          if (error instanceof UserError)
            return interaction.respond([
              {
                name: error.message,
                value: error.message,
              },
            ]);
        }
      }

      try {
        await command.completion(interaction);
      } catch (error) {
        interaction.client.reportError(error as Error);
      }
    }

    if (interaction.isChatInputCommand()) {
      for (const check of command.checks) {
        try {
          const ok = await check(interaction);
          if (!ok) return;
        } catch (error) {
          if (error instanceof UserError)
            return interaction.reply(error.message);
        }
      }

      try {
        await command.run(interaction);
      } catch (error) {
        if (error instanceof UserError) return interaction.reply(error.message);

        if (!interaction.replied)
          interaction.reply("Có lỗi xảy ra khi chạy lệnh này :<");
        else interaction.followUp("Có lỗi xảy ra khi chạy lệnh này :<");
        interaction.client.reportError(error as Error);
      }
    }
  },
});
