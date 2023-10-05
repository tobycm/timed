import { ChannelType } from "discord.js";
import { MessageFilter, MessageTrigger } from "models/triggers";
import { checkInSetup } from "modules/checks/eventSetup";
import { guildOnly } from "modules/checks/guild";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";
import triggerCommand from "./trigger";

export default new Command({
  data: triggerCommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Add a message trigger")
        .addUserOption((option) =>
          option.setName("user").setDescription("Only from this user")
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Only from this channel")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption((option) =>
          option.setName("role").setDescription("Only from this role")
        )
    )
    .toJSON(),
  checks: [checkInSetup, guildOnly],
  async run(interaction) {
    const user = interaction.options.getUser("user");
    const channel = interaction.options.getChannel("channel");
    const role = interaction.options.getRole("role");

    if (!user && !channel && !role) {
      interaction.reply({
        content: "You must specify a user, channel, or role",
        ephemeral: true,
      });
      return;
    }

    const filters: MessageFilter[] = [
      (message) => message.guild!.id === interaction.guild!.id,
    ];

    if (user) filters.push((message) => message.author.id === user.id);
    if (channel) filters.push((message) => message.channel.id === channel.id);
    if (role)
      filters.push((message) => message.member!.roles.cache.has(role.id));

    eventSetups
      .get(interaction.user.id)!
      .addTrigger(new MessageTrigger(filters));

    interaction.reply({
      content: "Added message trigger",
      ephemeral: true,
    });
  },
});
