import "./Records.css"

import Header from "./Header.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {
    addSession,
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

const getTopForHourAnnotation = (h: number, pixPerMin: number, todayStartTime: Date) => {
    const hourDate = new Date()
    hourDate.setHours(h)
    hourDate.setMinutes(0)
    hourDate.setSeconds(0)
    return pixPerMin * getMinDiff(todayStartTime, hourDate) - 10
}

const date2inputVal = (date: Date) => {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const RecordsGraph = () => {
    const [todayDoneSessionList, setTodayDoneSessionList] = useState<Session[]>(doneSessionListSample)
    const [todayStartTime, setTodayStartTime] = useState<Date>(doneSession1.startTime)

    const [barEndTime, setBarEndTime] = useState<Date>(getTimeInTwoHours);
    useEffect(() => {
        getTodaySessions().then((data) => {
            setTodayDoneSessionList(data)
            if (data.length > 0) {
                setTodayStartTime(() => data[0].startTime)
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

    let hours = Array.from({ length: 24 }, (_, index) => index);
    hours = hours.filter(num => startTime.getHours() < num && num <= barEndTime.getHours());

    const initStart = new Date()
    initStart.setMinutes(initStart.getMinutes() - 25)
    const [newRecordStartTime, setNewRecordStartTime] = useState<Date>(initStart)
    const [newRecordEndTime, setNewRecordEndTime] = useState<Date>(new Date())

    const handleNewRecordStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const [h, m] = event.target.value.split(':').map(Number);
        setNewRecordStartTime((prev) => {
            const newStart = new Date(prev.getTime())
            newStart.setHours(h)
            newStart.setMinutes(m)
            return newStart
        })
    }

    const handleNewRecordEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const [h, m] = event.target.value.split(':').map(Number);
        setNewRecordEndTime((prev) => {
            const newStart = new Date(prev.getTime())
            newStart.setHours(h)
            newStart.setMinutes(m)
            return newStart
        })
    }

    const handleAdd = () => {
        const doneSession: Session = {
            startTime: newRecordStartTime,
            endTime: newRecordEndTime,
        }

        addSession(doneSession);
        setTodayDoneSessionList((prev) => [...prev, doneSession])
    }

    return (
        <>
            <Header/>
            <div className="records-bar">
                <div className="startTime">{startTimeDisplay}</div>

                {
                    hours.map((h) => (
                        <div className="hours-annotation" style={{top: getTopForHourAnnotation(h, pixPerMin, todayStartTime)}}>
                            {h.toString() + ":00"}
                        </div>
                    ))
                }

                {
                    todayDoneSessionList.map((session) => (
                        <div className="doneSession" style={{
                            top: getTop(session, pixPerMin, todayStartTime),
                            height: getHeight(session, pixPerMin),
                            right: 0
                        }}></div>
                    ))
                }
            </div>

            <div className="add-record">
                <label htmlFor="start-time">start time</label>
                <input type="time" id="start-time" value={date2inputVal(newRecordStartTime)} onChange={handleNewRecordStartTimeChange}/>

                <label htmlFor="end-time">end time</label>
                <input type="time" id="end-time" value={date2inputVal(newRecordEndTime)} onChange={handleNewRecordEndTimeChange}/>

                <button onClick={handleAdd}>Add</button>
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
            <p>{start_h}:{start_m} - {end_h}:{end_m} ({diff_m}m{diff_s_remain}s)</p>
        </div>
    );
}

const RecordsText = () => {
    const [doneSessionList, setDoneSessionList] = useState<Session[]>(doneSessionListSample);
    useEffect(() => {
        getAllSessions().then((data) => {
            setDoneSessionList(data)
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