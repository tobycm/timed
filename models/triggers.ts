import { Message } from "discord.js";
import { messageTriggers } from "events/messageTrigger";
import { randomString } from "modules/utils";

export class Trigger {
  async start(trigger: () => any) {
    this.trigger = trigger;
  }
  public trigger() {}
  async stop() {}
}

export class IntervalTrigger extends Trigger {
  constructor(interval: number) {
    super();
    this.interval = interval;
  }

  public interval: number;
  private _interval?: NodeJS.Timeout;

  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;
    this._interval = setInterval(this.trigger, this.interval);
    return;
  }

  async stop(): Promise<void> {
    clearInterval(this._interval);
  }
}

export type MessageFilter = (
  message: Message<true>
) => Promise<boolean> | boolean;

export class MessageTrigger extends Trigger {
  constructor(filters?: MessageFilter[]) {
    super();
    this.filters = filters ?? [];
  }

  protected filters: MessageFilter[];
  public addFilter(filter: MessageFilter) {
    this.filters.push(filter);
  }

  public removeFilter(filter: MessageFilter) {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  protected filterSignature = "";
  protected async filter(message: Message<true>): Promise<any> {
    for (const filter of this.filters) {
      if (!(await filter(message))) return;
    }
    this.trigger();
  }

  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;

    do {
      this.filterSignature = randomString(10);
    } while (messageTriggers.has(this.filterSignature));

    messageTriggers.set(this.filterSignature, this.filter.bind(this));
    return;
  }

  async stop(): Promise<void> {
    messageTriggers.delete(this.filterSignature);
  }
}
