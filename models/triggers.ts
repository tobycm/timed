import { Message, User } from "discord.js";
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

class MessageTrigger extends Trigger {
  constructor() {
    super();
  }

  protected filterSignature = "";
  protected async filter(message: Message): Promise<any> {
    this.trigger();
  }

  async start(trigger: () => any): Promise<void> {
    this.trigger = trigger;

    do {
      this.filterSignature = randomString(10);
    } while (messageTriggers.has(this.filterSignature));

    messageTriggers.set(this.filterSignature, this.filter);
    return;
  }

  async stop(): Promise<void> {
    messageTriggers.delete(this.filterSignature);
  }
}

export class MessageAuthorTrigger extends MessageTrigger {
  constructor(author: User) {
    super();

    this.filter = async (message: Message) => {
      if (message.author.id === author.id) this.trigger();
    };
  }
}
