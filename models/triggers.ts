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
