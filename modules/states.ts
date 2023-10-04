// don't ask about the filename

import { Snowflake } from "discord.js";
import { TriggerEvent } from "models/events";

export const eventSetups: Map<Snowflake, TriggerEvent> = new Map();
