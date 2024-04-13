import './App.css';

import {useEffect, useState} from "react";
import Push from "push.js";
import {addSession, getSessionLengthMin, getSettings, getTotalMinutes, Session, Settings} from "./types/session.ts"
import {amplifyIfProdEnv, displayedMinutes, padZero} from "./Util.ts";
import {RecordsBar} from "./Records.tsx";
import Header from "./Header.tsx";
import {useRecoilState} from "recoil";
import {currentStartTimeState, settingsState} from "./state.ts";
import useTimer from "./react-timer-hook/useTimer.ts";


function timerString(minutes: number, seconds: number) {
    return minutes.toString() + ":" + padZero(seconds)
}

const Timer = (settings: Settings) => {
    console.log("timer called")
    const [curSessionStartTime, setCurSessionStartTime] = useRecoilState(currentStartTimeState);

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

            addSession(doneSession);
            setTotalMinutes((prev) => prev + getSessionLengthMin(doneSession))
            setCurSessionStartTime(null);

            const time = new Date();
            time.setSeconds(time.getSeconds() + amplifyIfProdEnv(length));

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

    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        getTotalMinutes().then((data) => {
            setTotalMinutes(() => data)
        })
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

                    <div><p>total {displayedMinutes(totalMinutes)} / {displayedMinutes(settings.goalMinutes)} ({(totalMinutes / settings.goalMinutes * 100).toFixed(0)} %)</p></div>
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
