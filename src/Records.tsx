import "./Records.css"

import {ChangeEvent, useEffect, useState} from "react";
import {
    addSessionToDb,
    getMinDiff,
    getSessionLengthMin,
    getTodaySessions,
    Session
} from "./types/session.ts";
import {padZero} from "./Util.ts";
import {useRecoilState} from "recoil";
import {todayDoneSessionListState} from "./state.ts";

const getBarEndTime = () => {
    const t = new Date();
    t.setHours(t.getHours() + 1)
    return t;
}

const getHeight = (session: Session, pixPerMin: number) => {
    const minDiff = getSessionLengthMin(session)
    return pixPerMin * minDiff
}

const getTop = (session: Session, pixPerMin: number, todayStartTime: Date) => {
    return pixPerMin * getMinDiff(todayStartTime, session.startTime)
}

const getMiddle = (session: Session, pixPerMin: number, todayStartTime: Date) => {
    return pixPerMin * getMinDiff(todayStartTime, session.startTime) + getHeight(session, pixPerMin) * 0.5 - 20
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

export const RecordsBar = () => {
    const [todayDoneSessionList, setTodayDoneSessionList] = useRecoilState(todayDoneSessionListState)
    const [todayStartTime, setTodayStartTime] = useState<Date>(new Date())

    const [barEndTime, setBarEndTime] = useState<Date>(getBarEndTime);
    useEffect(() => {
        getTodaySessions().then((data) => {
            setTodayDoneSessionList(data)
        })

        const timer = setInterval(() => {
            setBarEndTime(getBarEndTime());
        }, 10000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (todayDoneSessionList.length > 0) {
            setTodayStartTime(() => todayDoneSessionList[0].startTime)
        }
    }, [todayDoneSessionList]);


    const minutesLengthInBar = getMinDiff(todayStartTime, barEndTime)
    const barLengthPixel = 720;
    const pixPerMin = barLengthPixel / minutesLengthInBar;

    const startTimeDisplay = todayStartTime.getHours() + ":" + padZero(todayStartTime.getMinutes())

    let hours = Array.from({ length: 24 }, (_, index) => index);
    hours = hours.filter(num => todayStartTime.getHours() < num && num <= barEndTime.getHours());

    const [focusedDoneSession, setFocusedDoneSession] = useState(-1);

    return (
        <>
            <div className="records-bar">
                <div className="startTime">{startTimeDisplay}</div>
                {
                    hours.map((h) => (
                        <div className="hours-annotation"
                             style={{top: getTopForHourAnnotation(h, pixPerMin, todayStartTime)}}>
                            {h.toString() + ":00"}
                        </div>
                    ))
                }

                {
                    todayDoneSessionList.map((session, index) => (
                        <>
                            <div className={"doneSession" + " doneSession-" + index}
                                 onMouseEnter={() => {
                                     setFocusedDoneSession(() => index)
                                 }}
                                 onMouseLeave={() => {
                                     setFocusedDoneSession(() => -1)
                                 }}
                                 style={{
                                     position: "absolute",
                                     top: getTop(session, pixPerMin, todayStartTime),
                                     height: getHeight(session, pixPerMin),
                                     right: 0
                                 }}></div>
                            {focusedDoneSession === index ?
                                <div className="focusedDoneSession" style={{
                                    position: "absolute",
                                    top: getMiddle(session, pixPerMin, todayStartTime),
                                }}>{DoneSession(session)}</div> :
                                <></>
                            }
                        </>
                    ))
                }

            </div>

            {AddRecord(setTodayDoneSessionList)}
        </>
    )
}

const AddRecord = (setDoneSessionList: React.Dispatch<React.SetStateAction<Session[]>>) => {
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

        addSessionToDb(doneSession);
        setDoneSessionList((prev) =>
            [...prev, doneSession].sort((a, b)=>a.startTime.getTime() - b.startTime.getTime())
        )
    }

    return (
        <div className="add-record">
            <label htmlFor="start-time">start time</label>
            <input type="time" id="start-time" value={date2inputVal(newRecordStartTime)}
                   onChange={handleNewRecordStartTimeChange}/>

            <label htmlFor="end-time">end time</label>
            <input type="time" id="end-time" value={date2inputVal(newRecordEndTime)}
                   onChange={handleNewRecordEndTimeChange}/>

            <button onClick={handleAdd}><i className="fa fa-plus"></i></button>
        </div>
    )
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
    const diff_m = Math.floor(diff_s / 60)

    return (
        <p>{start_h}:{start_m} - {end_h}:{end_m} ({diff_m}m)</p>
    );
}
