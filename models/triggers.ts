import { Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { messageTriggers } from "events/messageTrigger";
import { reactionAddTriggers } from "events/reactionAddTrigger";
import { reactionRemoveTriggers } from "events/reactionRemoveTrigger";
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

export type Filter = (...args: any[]) => Promise<boolean> | boolean;
export class FilterTrigger<F extends Filter> extends Trigger {
  constructor(filters?: F[]) {
    super();
    this.filters = filters ?? [];
  }

  protected filters: F[];
  public addFilter(filter: F): void {
    this.filters.push(filter);
  }

  public removeFilter(filter: F): void {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  protected filterSignature = "";
  protected async filter(...args: Parameters<F>): Promise<void> {
    for (const filter of this.filters) if (!(await filter(...args))) return;

    this.trigger();
  }

  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;
  }

  async stop(): Promise<void> {
    messageTriggers.delete(this.filterSignature);
  }
}

export type MessageFilter = (message: Message<true>) => Promise<boolean> | boolean;

export class MessageTrigger extends FilterTrigger<MessageFilter> {
  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;

    do this.filterSignature = randomString(10);
    while (messageTriggers.has(this.filterSignature));

    messageTriggers.set(this.filterSignature, this.filter.bind(this));
    return;
  }
}

export type ReactionFilter = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => Promise<boolean> | boolean;
export class ReactionAddTrigger extends FilterTrigger<ReactionFilter> {
  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;

    do this.filterSignature = randomString(10);
    while (reactionAddTriggers.has(this.filterSignature));

    reactionAddTriggers.set(this.filterSignature, this.filter.bind(this));
    return;
  }
}

export class ReactionRemoveTrigger extends FilterTrigger<ReactionFilter> {
  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;

    do this.filterSignature = randomString(10);
    while (reactionRemoveTriggers.has(this.filterSignature));

    reactionRemoveTriggers.set(this.filterSignature, this.filter.bind(this));
    return;
  }
}
