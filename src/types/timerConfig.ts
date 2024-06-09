import Dexie from "dexie";

export enum DurationType {
  Focus,
  ShortBreak,
  LongBreak
}

export function getPushMsg(durationType: DurationType) {
  if (durationType === DurationType.Focus) {
    return "Take a break"
  } else {
    return "Get back to work"
  }
}

class ConfigDB extends Dexie {
  settings: Dexie.Table<ISetting, string>;

  constructor() {
    super('configDB');
    this.version(1).stores({
      settings: 'key'
    });

    this.settings = this.table("settings");
  }
}

interface ISetting {
  key: string;
  value: number;
}

const configDB = new ConfigDB();

export class TimerConfig {
  focusLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  focusCntBeforeLongBreak: number;
  goalMinutesPerDay: number;

  constructor(focusLength: number, shortBreakLength: number, longBreakLength: number, focusCntBeforeLongBreak: number, goalMinutesPerDay: number) {
    this.focusLength = focusLength;
    this.shortBreakLength = shortBreakLength;
    this.longBreakLength = longBreakLength;
    this.focusCntBeforeLongBreak = focusCntBeforeLongBreak;
    this.goalMinutesPerDay = goalMinutesPerDay;
  }

  static async load() {
    const config = new TimerConfig(25, 5, 20, 4, 120);
    for (const key of Object.keys(config) as (keyof TimerConfig)[]) {
      const entry = await configDB.settings.get(key);
      if (entry) {
        config[key] = entry.value;
      }
    }
    return config;
  }
}

export async function save(timerConfig: TimerConfig) {
  for (const key of Object.keys(timerConfig) as (keyof TimerConfig)[]) {
    await configDB.settings.put({ key, value: timerConfig[key] });
  }
}
