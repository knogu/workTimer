export enum DurationType {
  Focus,
  ShortBreak,
  LongBreak
}

export async function fetchSettings(userId: string): Promise<timerConfig> {
  let settings: timerConfig = {
    userId: parseInt(userId),
    sessionLengthMin: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 10,
    sessionCntBeforeLongBreak: 3,
    goalMinutes: 300,
  }
  try {
    const response = await fetch('http://localhost:8080/config/' + userId);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    settings = {
      userId: parseInt(userId),
      sessionLengthMin: data.focusLength,
      shortBreakMinutes: data.shortBreakLength,
      longBreakMinutes: data.longBreakLength,
      sessionCntBeforeLongBreak: data.focusCntBeforeLongBreak,
      goalMinutes: 300,
    }
    return settings
  } catch (error) {
    console.error('Error fetching data: ', error);
    return settings
  }
}

export type timerConfig = {
  sessionLengthMin: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionCntBeforeLongBreak: number;
  goalMinutes: number;
  userId: number | undefined;
}

export async function putSettings(settings: timerConfig) {
  // return db.settings.put({ ...settings, id: 1})
}

export async function getTimerConfig() {
  return fetchSettings('1');
}

export function getPushMsg(durationType: DurationType) {
  if (durationType === DurationType.Focus) {
    return "Take a break"
  } else {
    return "Get back to work"
  }
}
