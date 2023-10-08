import { Events, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import Event from "modules/event";

export const reactionAddTriggers = new Map<string, (message: MessageReaction | PartialMessageReaction, user: User | PartialUser) => any>();

export default new Event({
  event: Events.MessageReactionAdd,
  async run(reaction, user) {
    if (user.bot) return;
    if (!reaction.message.inGuild()) return;
    reactionAddTriggers.forEach((trigger) => trigger(reaction, user));
  },
});
