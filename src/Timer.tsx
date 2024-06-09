import './App.css';
import './Timer.css';

import {useEffect, useState} from "react";
import Push from "push.js";
import {
  DurationType,
  getPushMsg,
} from "./types/timerConfig.ts"
import {
  addSessionToDb,
  getTodaySessions,
  Session,
} from "./types/session.ts"
import {padZero} from "./Util.ts";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  curAchievedMissionsState,
  curPauseDurationsState,
  currentDurationTypeState,
  currentStartTimeState,
  timerConfigState,
  todayDoneSessionListState
} from "./state.ts";
import useTimer from "./react-timer-hook/useTimer.ts";
import {curDate} from "./Util.ts";


function timerString(minutes: number, seconds: number) {
  return minutes.toString() + ":" + padZero(seconds)
}

export const Timer = () => {
  const [curSessionStartTime, setCurSessionStartTime] = useRecoilState(currentStartTimeState)
  const [curDurationType, setCurDurationType] = useRecoilState(currentDurationTypeState)
  const curPauseDurations = useRecoilValue(curPauseDurationsState)
  const [curAchievedMissions, setAchievedMissions] = useRecoilState(curAchievedMissionsState)
  const setTodayDoneSessionList = useSetRecoilState(todayDoneSessionListState)
  const [curDurationIdx, setDurationIdx] = useState(0);
  const settings = useRecoilValue(timerConfigState)

  const proceedDuration = () => {
    if (curDurationType === DurationType.Focus && curSessionStartTime !== null) { // curSessionStartTime is null when skipping the current focus duration without starting
      const doneSession: Session = {
        startTime: curSessionStartTime!,
        endTime: curDate(),
        pauseDurations: curPauseDurations,
        achievedMissions: [...curAchievedMissions],
      }
      setAchievedMissions([])

      addSessionToDb(doneSession);
      setTodayDoneSessionList((prev) => [...prev, doneSession])
    }

    setCurSessionStartTime(null);


    let nextMinutes: number;

    const nextDurationIdx = (curDurationIdx + 1) % (2 * settings.focusCntBeforeLongBreak)
    if (nextDurationIdx == 2 * settings.focusCntBeforeLongBreak - 1) {
      nextMinutes = settings.longBreakLength
      setCurDurationType(DurationType.LongBreak)
    } else if (nextDurationIdx % 2 == 0) {
      nextMinutes = settings.focusLength
      setCurDurationType(DurationType.Focus)
    } else {
      nextMinutes = settings.shortBreakLength
      setCurDurationType(DurationType.ShortBreak)
    }

    const time = curDate();
    time.setSeconds(time.getSeconds() + nextMinutes * 60);
    restart(time, false)

    setDurationIdx(() => nextDurationIdx)
  }

  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer(
      () => {
        proceedDuration()

        Push.create(getPushMsg(curDurationType), {
          body: getPushMsg(curDurationType),
          timeout: 4000,
          onClick: function () {
            window.focus();
          }
        });
      },
  );

  function onStart() {
    setCurSessionStartTime(curDate());
    start();
  }

  function startOrResume() {
    return (
        curSessionStartTime == null ?
            onStart
            :
            resume
    )
  }

  if (!Push.Permission.has()) {
    Push.Permission.request(() => {
    }, () => {
    });
  }

  useEffect(() => {
    getTodaySessions().then((sessions) => setTodayDoneSessionList(sessions))
  }, []);

  return (
        <div>
          <div className="timer-container">
            <div className="time">
              {timerString(minutes, seconds)}
            </div>

            <div>{
              curDurationType === DurationType.Focus ?
                  "Focus (" + (curDurationIdx / 2 + 1).toString() + " / " + settings.focusCntBeforeLongBreak + ")"
                  :
                  "Break"

            }</div>

            <div>
              {
                isRunning ?
                    <button className="timer-button" onClick={pause}><i className="fa fa-pause"></i></button>
                    :
                    <button className="timer-button" onClick={startOrResume()}><i className="fa fa-play"></i></button>
              }
            </div>

            <div>
              <button className="skip-button" onClick={proceedDuration}>
                {isRunning ? "finish now" : "skip"}
              </button>
            </div>
          </div>
        </div>
  );
}
