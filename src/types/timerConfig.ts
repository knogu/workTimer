export enum DurationType {
  Focus,
  ShortBreak,
  LongBreak
}

export async function fetchTimerConfig(userId: string): Promise<timerConfig> {
  let settings: timerConfig = {
    focusLength: 25,
    shortBreakLength: 5,
    longBreakLength: 10,
    focusCntBeforeLongBreak: 3,
    goalMinutesPerDay: 300,
  }
  try {
    const response = await fetch('http://localhost:8080/config/' + userId);
    if (response.status === 404) {
      // putSettings(userId, settings);
      return settings;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    settings = {
      focusLength: data.focusLength,
      shortBreakLength: data.shortBreakLength,
      longBreakLength: data.longBreakLength,
      focusCntBeforeLongBreak: data.focusCntBeforeLongBreak,
      goalMinutesPerDay: data.goalMinutesPerDay,
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
  goalMinutesPerDay: number;
}

export async function putSettings(userId: string, config: timerConfig) {
  try {
    const response = await fetch('http://localhost:8080/config/' + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error posting data: ', error);
  }
}

export function getPushMsg(durationType: DurationType) {
  if (durationType === DurationType.Focus) {
    return "Take a break"
  } else {
    return "Get back to work"
  }
}
