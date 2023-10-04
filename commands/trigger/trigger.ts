import { SlashCommandBuilder } from "discord.js";

const triggerCommand = new SlashCommandBuilder()
  .setName("trigger")
  .setDescription("Add a trigger to the event");

export default triggerCommand;
