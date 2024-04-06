import './App.css';

import {useEffect, useState} from "react";
import Push from "push.js";
import {useTimer} from "react-timer-hook";
import {useLocalStorage} from "./LocalStorage.tsx";
import {addSession, getSessionLengthMin, getTotalMinutes, Session} from "./types/session.ts"
import Header from "./Header.tsx";
import {displayedMinutes, padZero} from "./Util.ts";
import {RecordsBar} from "./Records.tsx";


function timerString(minutes: number, seconds: number) {
    return minutes.toString() + ":" + padZero(seconds)
}

function amplifyIfProdEnv(n: number) {
    return import.meta.env.MODE === 'production' ? n * 60 : n
}

const Timer = (length: number) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + amplifyIfProdEnv(length));
    const [curSessionStartTime, setCurSessionStartTime] = useState<Date | null>(null);

    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => {
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
    });

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

    const [goalMinutes] = useLocalStorage("goalMinutes", "360");
    const totalGoalMinutes = parseInt(goalMinutes);

    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        getTotalMinutes().then((data) => {
            setTotalMinutes(() => data)
        })
    }, []);

    return (
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

            <div><p>total {displayedMinutes(totalMinutes)} / {displayedMinutes(totalGoalMinutes)} ({(totalMinutes / totalGoalMinutes * 100).toFixed(0)} %)</p></div>
        </div>
    );
}



export default function App() {
    const [length] = useLocalStorage("sessionLength", "25");

    return (
        <>
            <Header/>
            <div className="contents">
                <div className="graph-container">
                    {RecordsBar()}
                </div>
                <div>
                    {Timer(parseInt(length))}
                </div>
            </div>
        </>
    );
}
