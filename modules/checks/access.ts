import { AutocompleteInteraction, ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { NoPermissions } from "modules/exceptions/guild";

export function checkOwner(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
  if (!interaction.client.owners.includes(interaction.user.id)) throw new NoPermissions();

  return true;
}

export function checkPermissions(permissions: PermissionResolvable[]) {
  return (message: ChatInputCommandInteraction | AutocompleteInteraction) => {
    if (!message.memberPermissions?.has(permissions)) throw new NoPermissions();

    return true;
  };
}
