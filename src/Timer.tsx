import './App.css';
import './Timer.css';

import {useEffect, useState} from "react";
import Push from "push.js";
import {DurationType, getPushMsg,} from "./types/timerConfig.ts"
import {
  addSessionToDb,
  getTodaySessionsWithAchievedGoals,
  Session,
  SessionWithAchievedGoals,
} from "./types/session.ts"
import {curDate, padZero} from "./Util.ts";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  curAchievedGoalsState,
  curPauseDurationsState, curPauseStartTimeState,
  currentDurationTypeState,
  currentStartTimeState,
  timerConfigState,
  todayDoneSessionListState
} from "./state.ts";
import useTimer from "./react-timer-hook/useTimer.ts";


function timerString(minutes: number, seconds: number) {
  return minutes.toString() + ":" + padZero(seconds)
}

export const Timer = () => {
  const [curSessionStartTime, setCurSessionStartTime] = useRecoilState(currentStartTimeState)
  const [curDurationType, setCurDurationType] = useRecoilState(currentDurationTypeState)
  const [curPauseDurations, setCurPauseDurations] = useRecoilState(curPauseDurationsState)
  const [curPauseStartTime, setCurPauseStartTime] = useRecoilState(curPauseStartTimeState)
  const [curAchievedMissions, setAchievedMissions] = useRecoilState(curAchievedGoalsState)
  const setTodayDoneSessionList = useSetRecoilState(todayDoneSessionListState)
  const [curDurationIdx, setDurationIdx] = useState(0);
  const settings = useRecoilValue(timerConfigState)

  const proceedDuration = () => {
    if (curDurationType === DurationType.Focus && curSessionStartTime !== null) { // curSessionStartTime is null when skipping the current focus duration without starting
      const goalIds = curAchievedMissions.map((mission) => mission.id!)
      const doneSession: Session = {
        startTime: curSessionStartTime!,
        endTime: curDate(),
        pauseDurations: curPauseStartTime !== null ? [...curPauseDurations, {pauseStart: curPauseStartTime, pauseEnd: curDate()}] : curPauseDurations,
        achievedMissionIds: [...goalIds],
      }

      addSessionToDb(doneSession);
      const doneSessionWithAchievedGoals: SessionWithAchievedGoals = {
        startTime: doneSession.startTime,
        endTime: doneSession.endTime,
        pauseDurations: doneSession.pauseDurations,
        achievedGoals: curAchievedMissions,
      }
      setTodayDoneSessionList((prev) => [...prev, doneSessionWithAchievedGoals])
      setAchievedMissions([])
    }

    setCurSessionStartTime(null);
    setCurPauseStartTime(null);
    setCurPauseDurations([]);

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
    getTodaySessionsWithAchievedGoals().then((sessions) => setTodayDoneSessionList(sessions))
  }, []);

  const postFix = (n: number) => {
    if (n === 1) {
      return "1st";
    } else if (n === 2) {
      return "2nd";
    } else if (n === 3) {
      return "3rd";
    } else {
      return n.toString() + "th";
    }
  }

  const statusString = () => {
    switch (curDurationType) {
      case DurationType.Focus:
        return "Focus (" + (curDurationIdx / 2 + 1).toString() + " / " + settings.focusCntBeforeLongBreak + ")";
      case DurationType.ShortBreak:
        return postFix((curDurationIdx - 1) / 2 + 1) + " Short Break";
      case DurationType.LongBreak:
        return "Long Break";
    }
  }

  return (
        <div>
          <div className="timer-container">
            <div className="time">
              {timerString(minutes, seconds)}
            </div>

            <div>{statusString()}</div>

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
                {/*todo: display skip logo*/}
              </button>
            </div>
          </div>
        </div>
  );
}
