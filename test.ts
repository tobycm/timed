import { SlashCommandBuilder } from "discord.js";

const testCommand = new SlashCommandBuilder().setName("test").setDescription("Test command");

console.log(
  testCommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("omg")
        .setDescription("Subcommand")
        .addStringOption((option) => option.setName("test").setDescription("Test option")),
    )
    .toJSON(),
);

console.log(
  testCommand
    .addSubcommand((subcommand) =>
      subcommand
        .setName("omg2")
        .setDescription("Subcommand")
        .addStringOption((option) => option.setName("test").setDescription("Test option")),
    )
    .toJSON(),
);

console.log(testCommand.toJSON());
