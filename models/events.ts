import { Trigger } from "./triggers";

interface TriggerEventOptions {
  name: string;
  description: string;
  triggers?: Trigger[];
  results?: (() => Promise<any>)[];
}

export class TriggerEvent {
  constructor(options: TriggerEventOptions) {
    this.name = options.name;
    this.description = options.description;
    this.triggers = options.triggers || [];
    this.results = options.results || [];
  }

  public name: string;
  public description: string;

  public triggers: Trigger[];

  public async runResults(): Promise<any> {
    for (const result of this.results) {
      await result();
    }
  }

  public async start(): Promise<void> {
    for (const trigger of this.triggers) {
      await trigger.start(this.runResults);
    }
  }

  public results: (() => Promise<any>)[];
}
