import "./RecordsPage.css"

import {RecordsBar} from "./RecordsBar.tsx";
import Header from "./Header.tsx";
import {curDate} from "./Util.ts";
import AchievedGoals from "./Achievements.tsx";
import {addSessionToDb, Session} from "./types/session.ts";
import {ChangeEvent, useState} from "react";
import {useSetRecoilState} from "recoil";
import {todayDoneSessionListState} from "./state.ts";

export default function RecordsPage() {
  const getDateString = () => {
    const today = curDate();
    return (today.getMonth() + 1).toString() + "/" + today.getDate().toString()
  }

  return (
      <>
        <Header />
        <div className="dateChoiceBlock">
          {getDateString()}
        </div>

        <div className="records-page-container">
          <div className="durations">
            <RecordsBar />
            <AddRecord/>
          </div>

          <AchievedGoals/>
        </div>
      </>
  )
}

const date2inputVal = (date: Date) => {
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

const AddRecord = () => {
  const setTodayDoneSessionList = useSetRecoilState(todayDoneSessionListState)
  const initStart = curDate()
  initStart.setMinutes(initStart.getMinutes() - 25)
  const [newRecordStartTime, setNewRecordStartTime] = useState<Date>(initStart)
  const [newRecordEndTime, setNewRecordEndTime] = useState<Date>(curDate())

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
      pauseDurations: [],
      achievedMissionIds: [],
    }

    addSessionToDb(doneSession);
    setTodayDoneSessionList((prev) =>
        [...prev, doneSession].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    )
  }

  return (
      <div className="add-record">
        <label htmlFor="start-time">start time</label>
        <input type="time" id="start-time" value={date2inputVal(newRecordStartTime)}
               onChange={handleNewRecordStartTimeChange} />

        <label htmlFor="end-time">end time</label>
        <input type="time" id="end-time" value={date2inputVal(newRecordEndTime)}
               onChange={handleNewRecordEndTimeChange} />

        <button onClick={handleAdd}><i className="fa fa-plus"></i></button>
      </div>
  )
}

