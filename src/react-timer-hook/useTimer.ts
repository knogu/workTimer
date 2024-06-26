import {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  curPauseDurationsState,
  curPauseStartTimeState,
  currentDurationTypeState,
  didStartState,
  expiryState,
  isRunningState,
  secondsState
} from "../state.js";
import {PauseDuration} from "../types/session.ts";
import useInterval from "./useInterval.ts";
import Time from "./Time.ts";
import {curDate} from "../Util.ts";
import {DurationType, TimerConfig} from "../types/timerConfig.ts";

const DEFAULT_DELAY = 1000;

interface TimerResult {
  totalSeconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: (newExpiryTimestamp: Date, autoStart?: boolean) => void;
}

export default function useTimer(onExpire: () => void) : TimerResult {
  const [seconds, setSeconds] = useRecoilState(secondsState);
  const [expiryTimestamp, setExpiryTimestamp] = useRecoilState(expiryState);
  const [isRunning, setIsRunning] = useRecoilState(isRunningState);
  const [didStart, setDidStart] = useRecoilState(didStartState);
  const [curPauseStartTime, setCurPauseStartTimeState] = useRecoilState(curPauseStartTimeState);
  const setCurPauseTimeDurations = useSetRecoilState(curPauseDurationsState);
  const curDurationType = useRecoilValue(currentDurationTypeState);
  const [delay, setDelay] = useState<number | null>(1000);

  useEffect(() => {
    if (!didStart) {
      TimerConfig.load().then((fetchedSettings) => {
        if (curDurationType === DurationType.Focus) {
          setSeconds(() => fetchedSettings.focusLength * 60)
        } else if (curDurationType === DurationType.ShortBreak) {
          setSeconds(() => fetchedSettings.shortBreakLength * 60)
        } else {
          setSeconds(() => fetchedSettings.longBreakLength * 60)
        }
      })

      const expiry = curDate()
      expiry.setSeconds(expiry.getSeconds() + seconds)
      setExpiryTimestamp(expiry)
    }
  }, []);

  const handleExpire = useCallback(() => {
    onExpire()
    setIsRunning(false);
    setDelay(null);
  }, [onExpire]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (curPauseStartTime !== null) {
      console.error("pauseTime should be null when getting paused")
    }
    setCurPauseStartTimeState(() => curDate())
  }, []);

  const restart = useCallback((newExpiryTimestamp: Date, newAutoStart = true) => {
    setDelay(1000);
    setDidStart(newAutoStart);
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(Time.getSecondsFromExpiry(newExpiryTimestamp));
  }, []);

  const resume = useCallback(() => {
    if (curPauseStartTime !== null) {
      const p: PauseDuration = {pauseStart: curPauseStartTime!, pauseEnd: curDate()} // need to use an instance different from `time` to prevent being overwritten
      setCurPauseTimeDurations((prev) => [...prev, p])
    }
    setCurPauseStartTimeState(null);
    const time = curDate();
    time.setMilliseconds(time.getMilliseconds() + (seconds * 1000));
    restart(time);
  }, [seconds, restart, curPauseStartTime]);

  const start = useCallback(() => {
    if (didStart) {
      setSeconds(Time.getSecondsFromExpiry(expiryTimestamp));
      setIsRunning(true);
    } else {
      resume();
    }
  }, [expiryTimestamp, didStart, resume]);

  useInterval(() => {
    if (delay !== DEFAULT_DELAY) {
      setDelay(DEFAULT_DELAY);
    }
    const secondsValue = Time.getSecondsFromExpiry(expiryTimestamp);
    setSeconds(secondsValue);
    if (secondsValue <= 0) {
      handleExpire();
    }
  }, isRunning ? delay : null);

  return {
    ...Time.getTimeFromSeconds(seconds), start, pause, resume, restart, isRunning,
  };
}
