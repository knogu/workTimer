import './App.css';

import { useState } from "react";
import Push from "push.js";
import { useTimer } from "react-timer-hook";
import {useLocalStorage} from "./LocalStorage.tsx";
import Header from "./Header.tsx";

type Session = {
    startTime: Date;
    endTime: Date;
}

function padZero(n: number) {
    let str = n.toString()
    if (str.length === 1) {
        str = "0" + str
    }
    return str
}

function displayedMinutes(minutes: number) {
    return Math.floor(minutes/60).toString() + ":" + padZero(minutes % 60)
}

function timerString(minutes: number, seconds: number) {
    return minutes.toString() + ":" + padZero(seconds)
}

function MyTimer({ expiryTimestamp }: { expiryTimestamp: Date }) {
    const [curSessionStartTime, setCurSessionStartTime] = useState<Date | null>(null);
    const [doneSessionList, setDoneSessionList] = useState<Session[]>([]);
    const [totalMinutes, setTotalMinutes] = useState<number>(0);

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
            const doneSession: Session = {
                startTime: curSessionStartTime!,
                endTime: new Date(),
            }
            setDoneSessionList([...doneSessionList, doneSession])
            setCurSessionStartTime(null);

            const time = new Date();
            // time.setMinutes(time.getMinutes() + 25);
            time.setSeconds(time.getSeconds() + 2);
            setTotalMinutes((prevTotalSeconds) => prevTotalSeconds + 25);

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
                <button onClick={onStart}>Start</button>
                :
                <button onClick={resume}>Resume</button>
        )
    }

    if(!Push.Permission.has()) {
        Push.Permission.request(()=>{}, ()=>{});
    }

    const totalGoalMinutes = 6 * 60;

    return (
        <div className="main-container">
            <div className="time">
                {timerString(minutes, seconds)}
            </div>

            <div>
                {
                    isRunning ?
                        <button onClick={pause}>Pause</button>
                        :
                        startOrResume()
                }

            </div>

            <div><p>total {displayedMinutes(totalMinutes)} / {displayedMinutes(totalGoalMinutes)} ({(totalMinutes / totalGoalMinutes * 100).toFixed(0)} %)</p></div>

            <div className="finished-sessions">
                <h1>finished sessions</h1>
                {doneSessionList.map((doneSession) => {
                    return DoneSession(doneSession)
                })}
            </div>
        </div>
    );
}

const DoneSession = (session: Session) => {
    const start = session.startTime
    const start_h = start.getHours()
    const start_m = padZero(start.getMinutes())
    const start_s = padZero(start.getSeconds())

    const end = session.endTime
    const end_h = end.getHours()
    const end_m = padZero(end.getMinutes())
    const end_s = padZero(end.getSeconds())

    const diff = end.getTime() - start.getTime()
    const diff_s = Math.floor(diff / 1000)
    const diff_m = Math.floor(diff_s / 60)

    return (
        <div>
            <p>{start_h}:{start_m}:{start_s} - {end_h}:{end_m}:{end_s}  ({diff_m}m{diff_s}s)</p>
        </div>
    );
}

export default function App() {
    const time = new Date();
    const [length] = useLocalStorage("sessionLength", "25");
    time.setSeconds(time.getSeconds() + parseInt(length));
    // time.setMinutes(time.getSeconds() + parseInt(length));
    return (
        <>
            <Header/>
            <div>
                <MyTimer expiryTimestamp={time}/>
            </div>
        </>
    );
}
