import { Trigger } from "./triggers";

interface EventOptions {
  name: string;
  description: string;
  outputs?: (() => Promise<any>)[];
}
class Event {
  constructor(options: EventOptions) {
    this.name = options.name;
    this.description = options.description;
    this.outputs = options.outputs ?? [];
  }

  public name: string;
  public description: string;

  public get running(): boolean {
    return this._running;
  }

  protected set running(value: boolean) {
    this._running = value;
  }

  protected _running: boolean = false;

  protected outputs: (() => Promise<any>)[] = [];

  public addOutput(output: () => Promise<any>): void {
    this.outputs.push(output);
  }

  public removeOutput(output: () => Promise<any>): void {
    this.outputs = this.outputs.filter((o) => o !== output);
  }

  public async runOutputs(): Promise<void> {
    console.log(this);

    for (const output of this.outputs) {
      output();
    }
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

  public addTrigger(trigger: Trigger): void {
    this.triggers.push(trigger);
  }

  public removeTrigger(trigger: Trigger): void {
    this.triggers = this.triggers.filter((t) => t !== trigger);
  }

  private triggers: Trigger[];

  async start(): Promise<void> {
    this.running = true;
    for (const trigger of this.triggers) {
      await trigger.start(this.runOutputs.bind(this));
    }
  }

  async stop(): Promise<void> {
    this.running = false;
    for (const trigger of this.triggers) {
      await trigger.stop();
    }
  }
}
