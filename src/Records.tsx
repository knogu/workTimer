import "./Records.css"

import Header from "./Header.tsx";
import {useEffect, useState} from "react";
import {
    getAllSessions,
    getMinDiff,
    getSessionLengthMin,
    getTodaySessions,
    Session
} from "./types/session.ts";
import {isProd, padZero} from "./Util.ts";

const doneSession1: Session = {
    startTime: new Date(2024, 3, 6, 8, 0),
    endTime: new Date(2024, 3, 6, 8, 15),
}

const doneSession2: Session = {
    startTime: new Date(2024, 3, 6, 8, 50),
    endTime: new Date(2024, 3, 6, 9, 0),
}

const doneSession3: Session = {
    startTime: new Date(2024, 3, 6, 9, 10),
    endTime: new Date(2024, 3, 6, 10, 0),
}

const doneSessionListSample = [doneSession1, doneSession2, doneSession3]

export const Records = () => {
    return isProd() ? RecordsText() : RecordsGraph()
}

const getTimeInTwoHours = () => {
    const t = new Date();
    t.setHours(t.getHours() + 2)
    return t;
}

const getHeight = (session: Session, pixPerMin: number) => {
    const minDiff = getSessionLengthMin(session)
    return pixPerMin * minDiff
}

const getTop = (session: Session, pixPerMin: number, todayStartTime: Date) => {
    return pixPerMin * getMinDiff(todayStartTime, session.startTime)
}

const RecordsGraph = () => {
    const divs = Array.from({ length: 12 }, (_, index) => index);

    const [todayDoneSessionList, setTodayDoneSessionList] = useState<Session[]>(doneSessionListSample)
    const [todayStartTime, setTodayStartTime] = useState<Date>(doneSession1.startTime)

    const [barEndTime, setBarEndTime] = useState<Date>(getTimeInTwoHours);
    useEffect(() => {
        getTodaySessions().then((data) => {
            if (isProd()) {
                setTodayDoneSessionList(data)
                if (data.length > 0) {
                    setTodayStartTime(() => data[0].startTime)
                }
            }
        })

        const timer = setInterval(() => {
            setBarEndTime(getTimeInTwoHours());
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const minutesLengthInBar = getMinDiff(todayStartTime, barEndTime)
    const barLengthPixel = 720;
    const pixPerMin = barLengthPixel / minutesLengthInBar;

    const startTime = todayDoneSessionList[0]!.startTime
    const startTimeDisplay = startTime.getHours() + ":" + padZero(startTime.getMinutes())

    return (
        <>
            <Header/>
            <div className="records">
                {/*{divs.map((_, index) => (*/}
                {/*    <div className={"base-hour starting-" + (8 + index).toString()} key={8 + index}></div>*/}
                {/*))}*/}
                <div className="startTime">{startTimeDisplay}</div>

                {
                    todayDoneSessionList.map((session) => (
                        <div className="doneSession" style={{top: getTop(session, pixPerMin, todayStartTime), height: getHeight(session, pixPerMin), right: 0}}></div>
                    ))
                }
            </div>
        </>
    );
}

const DoneSession = (session: Session) => {
    const start = session.startTime
    const start_h = start.getHours()
    const start_m = padZero(start.getMinutes())

    const end = session.endTime
    const end_h = end.getHours()
    const end_m = padZero(end.getMinutes())

    const diff = end.getTime() - start.getTime()
    const diff_s = Math.floor(diff / 1000)
    const diff_s_remain = diff_s % 60
    const diff_m = Math.floor(diff_s / 60)

    return (
        <div>
            <p>{start_h}:{start_m} - {end_h}:{end_m}  ({diff_m}m{diff_s_remain}s)</p>
        </div>
    );
}

const RecordsText = () => {
    const [doneSessionList, setDoneSessionList] = useState<Session[]>(doneSessionListSample);
    useEffect(() => {
        getAllSessions().then((data) => {
            if (isProd()) {
                setDoneSessionList(data)
            }
        })
    }, []);
    return (
        <>
            <Header/>
            <div className="finished-sessions">
                <h1>finished sessions</h1>
                {doneSessionList.length > 0 ?
                    doneSessionList.map((doneSession) => {
                        return DoneSession(doneSession)
                    })
                    :
                    "no records yet"
                }
            </div>
        </>
    )
}