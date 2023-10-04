import { Trigger } from "./triggers";

interface EventOptions {
  name: string;
  description: string;
  results?: (() => Promise<any>)[];
}
class Event {
  constructor(options: EventOptions) {
    this.name = options.name;
    this.description = options.description;
    this.results = options.results ?? [];
  }

  public name: string;
  public description: string;

  public running: boolean = false;

  public results: (() => Promise<any>)[] = [];

  public async runResults(): Promise<any> {
    this.results.forEach(async (result) => await result());
  }

  public async start(): Promise<void> {
    this.running = true;
  }

  public async stop(): Promise<void> {
    this.running = false;
  }
}

interface TriggerEventOptions extends EventOptions {
  triggers?: Trigger[];
}

export class TriggerEvent extends Event {
  constructor(options: TriggerEventOptions) {
    super(options);
    this.triggers = options.triggers || [];
  }

  public triggers: Trigger[];

  async start(): Promise<void> {
    this.running = true;
    for (const trigger of this.triggers) {
      await trigger.start(this.runResults);
    }
  }

  async stop(): Promise<void> {
    this.running = false;
    for (const trigger of this.triggers) {
      await trigger.stop();
    }
  }
}
