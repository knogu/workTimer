export enum DurationType {
  Focus,
  ShortBreak,
  LongBreak
}

export async function fetchSettings(userId: string): Promise<timerConfig> {
  let settings: timerConfig = {
    userId: parseInt(userId),
    focusLength: 25,
    shortBreakLength: 5,
    longBreakLength: 10,
    focusCntBeforeLongBreak: 3,
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
      focusLength: data.focusLength,
      shortBreakLength: data.shortBreakLength,
      longBreakLength: data.longBreakLength,
      focusCntBeforeLongBreak: data.focusCntBeforeLongBreak,
      goalMinutes: 300,
    }
    return settings
  } catch (error) {
    console.error('Error fetching data: ', error);
    return settings
  }
}

export type timerConfig = {
  focusLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  focusCntBeforeLongBreak: number;
  goalMinutes: number;
  userId: number | undefined;
}

export type timerConfigReq = {
  focusLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  focusCntBeforeLongBreak: number;
}

export async function putSettings(userId: string, config: timerConfig) {
  const req: timerConfigReq = {
    focusLength: config.focusLength,
    shortBreakLength: config.shortBreakLength,
    longBreakLength: config.longBreakLength,
    focusCntBeforeLongBreak: config.focusCntBeforeLongBreak,
  }
  try {
    const response = await fetch('http://localhost:8080/config/' + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });



    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error posting data: ', error);
  }
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
