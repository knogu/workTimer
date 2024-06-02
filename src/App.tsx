import './App.css';

import {useEffect} from "react";
import Push from "push.js";
import {
  DurationType,
  getPushMsg,
} from "./types/timerConfig.ts"
import {
  addSessionToDb,
  getTodaySessions,
  Session,
  sessionMinutesSum,
} from "./types/session.ts"
import {displayedMinutes, padZero} from "./Util.ts";
import {RecordsBar} from "./RecordsBar.tsx";
import Header from "./Header.tsx";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  curPauseDurationsState,
  currentDurationTypeState,
  currentStartTimeState,
  timerConfigState,
  todayDoneSessionListState
} from "./state.ts";
import useTimer from "./react-timer-hook/useTimer.ts";


function timerString(minutes: number, seconds: number) {
    return minutes.toString() + ":" + padZero(seconds)
}

const Timer = () => {
    const [curSessionStartTime, setCurSessionStartTime] = useRecoilState(currentStartTimeState)
    const [curDurationType, setCurDurationType] = useRecoilState(currentDurationTypeState)
    const curPauseDurations = useRecoilValue(curPauseDurationsState)
    const [todayDoneSessionList, setTodayDoneSessionList] = useRecoilState(todayDoneSessionListState)
    const settings = useRecoilValue(timerConfigState)
    let curDurationIdx = 0;

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
            if (curDurationType === DurationType.Focus) {
              const doneSession: Session = {
                startTime: curSessionStartTime!,
                endTime: new Date(),
                pauseDurations: curPauseDurations,
              }

              addSessionToDb(doneSession);
              setTodayDoneSessionList((prev) => [...prev, doneSession])
            }

            Push.create(getPushMsg(curDurationType), {
              body: getPushMsg(curDurationType),
              timeout: 4000,
              onClick: function () {
                window.focus();
              }
            });

            setCurSessionStartTime(null);

            const time = new Date();
            let nextMinutes: number;
            curDurationIdx += 1;
            curDurationIdx %= 2 * settings.focusCntBeforeLongBreak
            if (curDurationIdx == 2 * settings.focusCntBeforeLongBreak - 1) {
              nextMinutes = settings.longBreakLength
              setCurDurationType(DurationType.LongBreak)
            } else if (curDurationIdx % 2 == 0) {
              nextMinutes = settings.focusLength
              setCurDurationType(DurationType.Focus)
            } else {
              nextMinutes = settings.shortBreakLength
              setCurDurationType(DurationType.ShortBreak)
            }
            time.setSeconds(time.getSeconds() + nextMinutes * 60);

            restart(time, false)
        },
    );

    function onStart() {
        setCurSessionStartTime(new Date());
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

    if(!Push.Permission.has()) {
        Push.Permission.request(()=>{}, ()=>{});
    }

    useEffect(() => {
        getTodaySessions().then((sessions) => setTodayDoneSessionList(sessions))
    }, []);

    return (
        <div className="contents">
            <div className="graph-container">
                {RecordsBar()}
            </div>
            <div>
                <div className="timer-container">
                    <div className="time">
                        {timerString(minutes, seconds)}
                    </div>

                    <div>{
                      curDurationType === DurationType.Focus ?
                          "Focus"
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

                    <div><p>total {displayedMinutes(sessionMinutesSum(todayDoneSessionList))} / {displayedMinutes(settings.goalMinutesPerDay)} ({(sessionMinutesSum(todayDoneSessionList) / settings.goalMinutesPerDay * 100).toFixed(0)} %)</p></div>
                </div>
            </div>
        </div>


    );
}

export const TimerPage = () => {
    return (
        <>
            <Header/>
            {Timer()}
        </>
    )
}
