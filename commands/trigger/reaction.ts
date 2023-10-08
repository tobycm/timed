import { ChannelType, SlashCommandBuilder } from "discord.js";
import { TriggerEvent } from "models/events";
import { Filter, ReactionAddTrigger, ReactionRemoveTrigger } from "models/triggers";
import { Command } from "modules/command";
import { eventSetups } from "modules/states";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("trigger_reaction")
    .setDescription("Add a reaction trigger")
    .addUserOption((option) => option.setName("user").setDescription("From user"))
    .addStringOption((option) => option.setName("emoji").setDescription("Filter by emoji"))
    .addIntegerOption((option) => option.setName("message").setDescription("On message"))
    .addChannelOption((option) => option.setName("channel").setDescription("Channel").addChannelTypes(ChannelType.GuildText))
    .addRoleOption((option) => option.setName("role").setDescription("From role"))
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action")
        .addChoices({ name: "Add", value: "add" }, { name: "Remove", value: "remove" }, { name: "Both", value: "both" })
        .setRequired(true),
    )
    .toJSON(),
  async run(interaction) {
    const user = interaction.options.getUser("user");
    const emoji = interaction.options.getString("emoji");
    const message = interaction.options.getInteger("message");
    const channel = interaction.options.getChannel("channel", false, [ChannelType.GuildText]);
    const role = interaction.options.getRole("role");

    if (!user && !emoji && !message && !channel && !role) {
      interaction.reply({ content: "You must specify at least one filter", ephemeral: true });
      return;
    }

    const filters: Filter[] = [];

    if (user) filters.push((message) => message.author.id === user.id);
    if (emoji) filters.push((reaction) => reaction.emoji.name === emoji);
    if (message) filters.push((reaction) => reaction.message.id === message);
    if (channel) filters.push((reaction) => reaction.message.channel.id === channel.id);
    if (role) filters.push((reaction) => reaction.message.guild?.members.cache.get(reaction.user.id)?.roles.cache.has(role.id));

    const action = interaction.options.getString("action", true);

    const event = eventSetups.get(interaction.user.id) as TriggerEvent;

    switch (action) {
      case "add":
        event.addTrigger(new ReactionAddTrigger(filters));
        break;
      case "remove":
        event.addTrigger(new ReactionRemoveTrigger(filters));
        break;
      case "both":
        event.addTrigger(new ReactionAddTrigger(filters));
        event.addTrigger(new ReactionRemoveTrigger(filters));
        break;
    }

    interaction.reply({ content: "Added reaction trigger", ephemeral: true });
  },
});
