import {useState, useCallback, useEffect} from 'react';
import {useRecoilState} from "recoil";
import {didStartState, expiryState, isRunningState, secondsState} from "../state.js";
import {getSettings} from "../types/session.ts";
import {amplifyIfProdEnv} from "../Util.ts";
import useInterval from "./useInterval.ts";
import Time from "./Time.ts";

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
  const [delay, setDelay] = useState<number | null>(1000);

  useEffect(() => {
    if (!didStart) {
      getSettings().then((fetchedSettings) => {
        setSeconds(() => amplifyIfProdEnv(fetchedSettings.sessionLengthMin))
      })

      const expiry = new Date()
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
  }, []);

  const restart = useCallback((newExpiryTimestamp: Date, newAutoStart = true) => {
    setDelay(1000);
    setDidStart(newAutoStart);
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(Time.getSecondsFromExpiry(newExpiryTimestamp));
  }, []);

  const resume = useCallback(() => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + (seconds * 1000));
    restart(time);
  }, [seconds, restart]);

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
