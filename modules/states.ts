// don't ask about the filename

import { Snowflake } from "discord.js";
import { Event, TriggerEvent } from "models/events";

export const eventSetups: Map<Snowflake, Event | TriggerEvent> = new Map(); // events that are being setup userId -> event

export const events: Map<Snowflake, Map<string, Event>> = new Map(); // finished events userId -> event name -> event
