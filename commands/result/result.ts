import { SlashCommandBuilder } from "discord.js";

const resultCommand = new SlashCommandBuilder()
  .setName("result")
  .setDescription("Add a result to the event");

export default resultCommand;
