import './App.css';

import {useEffect} from "react";
import Push from "push.js";
import {
    addSessionToDb,
    getSettings, getTodaySessions,
    Session, sessionMinutesSum,
    Settings
} from "./types/session.ts"
import {amplifyIfProdEnv, displayedMinutes, padZero} from "./Util.ts";
import {RecordsBar} from "./Records.tsx";
import Header from "./Header.tsx";
import {useRecoilState} from "recoil";
import {currentStartTimeState, settingsState, todayDoneSessionListState} from "./state.ts";
import useTimer from "./react-timer-hook/useTimer.ts";


function timerString(minutes: number, seconds: number) {
    return minutes.toString() + ":" + padZero(seconds)
}

const Timer = (settings: Settings) => {
    const [curSessionStartTime, setCurSessionStartTime] = useRecoilState(currentStartTimeState)
    const [todayDoneSessionList, setTodayDoneSessionList] = useRecoilState(todayDoneSessionListState)

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
            // TODO: 停止してる間を考慮
            const doneSession: Session = {
                startTime: curSessionStartTime!,
                endTime: new Date(),
            }

            addSessionToDb(doneSession);
            setTodayDoneSessionList((prev) => [...prev, doneSession])
            setCurSessionStartTime(null);

            const time = new Date();
            time.setSeconds(time.getSeconds() + amplifyIfProdEnv(settings.sessionLengthMin));

            Push.create("Session finished", {
                body: "Take a break",
                timeout: 4000,
                onClick: function () {
                    window.focus();
                }
            });

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

                    <div>
                        {
                            isRunning ?
                                <button className="timer-button" onClick={pause}><i className="fa fa-pause"></i></button>
                                :
                                <button className="timer-button" onClick={startOrResume()}><i className="fa fa-play"></i></button>
                        }

                    </div>

                    <div><p>total {displayedMinutes(sessionMinutesSum(todayDoneSessionList))} / {displayedMinutes(settings.goalMinutes)} ({(sessionMinutesSum(todayDoneSessionList) / settings.goalMinutes * 100).toFixed(0)} %)</p></div>
                </div>
            </div>
        </div>


    );
}

export const TimerPage = () => {
    const [settings, setSettings] = useRecoilState(settingsState);
    useEffect(() => {
        getSettings().then((fetchedSettings) => {
            setSettings(fetchedSettings)
        })
    }, []);
    return (
        <>
            <Header/>
            {Timer(settings)}
        </>
    )
}
