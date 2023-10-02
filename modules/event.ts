import { ClientEvents } from "discord.js";

interface EventOptions<E extends keyof ClientEvents> {
  disabled?: boolean;
  event: E;
  once?: boolean;
  run: (...args: ClientEvents[E]) => Promise<any>;
}

export default class Event<E extends keyof ClientEvents> {
  constructor(options: EventOptions<E>) {
    this.disabled = options.disabled ?? false;
    this.event = options.event;
    this.once = options.once;
    this.run = options.run;
  }

  disabled;
  event;
  once?;
  run;
}
