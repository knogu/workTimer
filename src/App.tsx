import './App.css';

import {useEffect, useState} from "react";
import Push from "push.js";
import {useTimer} from "react-timer-hook";
import {useLocalStorage} from "./LocalStorage.tsx";
import Header from "./Header.tsx";
import Dexie from 'dexie';

type Session = {
    startTime: Date;
    endTime: Date;
}

class Database extends Dexie {
    public sessions: Dexie.Table<Session, number>;

    public constructor() {
        super('Database');
        this.version(1).stores({
            sessions: '++id, startTime, endTime',
        });
        this.sessions = this.table('sessions');
    }
}

const db = new Database();

async function addSession(session: Session) {
    try {
        await db.sessions.add(session);
        console.log("added")
    } catch (error) {
        console.error(error);
    }
}

async function getAllSessions(): Promise<Session[]> {
    try {
        return await db.sessions.toArray();
    } catch (error) {
        console.error(error);
        return [];
    }
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

function amplifyIfProdEnv(n: number) {
    return import.meta.env.MODE === 'production' ? n * 60 : n
}

const Timer = (length: number) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + amplifyIfProdEnv(length));
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

            addSession(doneSession);
            setDoneSessionList([...doneSessionList, doneSession])

            setCurSessionStartTime(null);

            const time = new Date();
            time.setSeconds(time.getSeconds() + amplifyIfProdEnv(length));
            setTotalMinutes((prevTotalMinutes) => prevTotalMinutes + length);

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

    useEffect(() => {
        getAllSessions().then((data) => {
            setDoneSessionList(data)
        })
    }, []);

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
                {   doneSessionList.length > 0 ?
                    doneSessionList.map((doneSession) => {
                        return DoneSession(doneSession)
                    })
                    :
                    "no records yet"
                }
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
    const diff_s_remain = diff_s % 60
    const diff_m = Math.floor(diff_s / 60)

    return (
        <div>
            <p>{start_h}:{start_m}:{start_s} - {end_h}:{end_m}:{end_s}  ({diff_m}m{diff_s_remain}s)</p>
        </div>
    );
}

export default function App() {
    const [length] = useLocalStorage("sessionLength", "25");
    return (
        <>
            <Header/>
            <div>
                {Timer(parseInt(length))}
            </div>
        </>
    );
}
