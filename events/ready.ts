import { ActivityType, Events } from "discord.js";
import Event from "modules/event";

export default new Event({
  event: Events.ClientReady,
  async run(client) {
    console.log(`Logged in as ${client.user!.tag}!`);

    client.user!.setActivity("with Toby", { type: ActivityType.Playing });
  },
});
