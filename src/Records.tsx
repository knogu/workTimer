import "./Records.css"

import Header from "./Header.tsx";
import {useEffect, useState} from "react";
import {getAllSessions, Session} from "./types/session.ts";

export const Records = () => {
    const divs = Array.from({ length: 12 }, (_, index) => index);

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
    const [doneSessionList, setDoneSessionList] =
        useState<Session[]>([doneSession1, doneSession2, doneSession3]);
    // useEffect(() => {
    //     getAllSessions().then((data) => {
    //         setDoneSessionList(data)
    //     })
    // }, []);


    const getMinDiff = (earlier: Date, later: Date) => {
        const diffInMilliseconds: number = later.getTime() - earlier.getTime();
        return diffInMilliseconds / (1000 * 60);
    }

    const getSessionLengthMin = (session: Session) => {
        const diffInMilliseconds: number = session.endTime.getTime() - session.startTime.getTime();
        return diffInMilliseconds / (1000 * 60);
    }

    const getHeight = (session: Session) => {
        const minDiff = getSessionLengthMin(session)
        return Math.floor(60 * minDiff / 60)
    }

    const getTop = (session: Session) => {
        return getMinDiff(new Date(2024, 3, 6, 8, 0), session.startTime)
    }

    return (
        <>
            <Header/>
            <div className="records">
                {divs.map((_, index) => (
                    <div className={"base-hour starting-" + (8 + index).toString()} key={8 + index}></div>
                ))}

                {
                    doneSessionList.map((session, _) => (

                        <div className="doneSession" style={{top: getTop(session), height: getHeight(session), right: 0}}></div>
                    ))
                }
            </div>
        </>
    );
}