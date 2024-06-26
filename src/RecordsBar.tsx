import "./RecordsBar.css"

import {useEffect, useState} from "react";
import {
  getActualFocusMinutes,
  getMinDiff,
  getSessionLengthMin,
  getTodaySessionsWithAchievedGoals,
  Session, sessionMinutesSum, SessionWithAchievedGoals
} from "./types/session.ts";
import {
  DurationType,
} from "./types/timerConfig.ts";
import {displayedMinutes, padZero} from "./Util.ts";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  currentStartTimeState,
  todayDoneSessionListState,
  secondsState,
  timerConfigState, currentDurationTypeState, curAchievedGoalsState
} from "./state.ts";
import {curDate} from "./Util.ts";
import {Goal} from "./types/goal.ts";

const getBarEndTime = () => {
  const t = curDate();
  t.setHours(t.getHours() + 1)
  return t;
}

const getHeight = (session: Session | SessionWithAchievedGoals, pixPerMin: number) => {
  const minDiff = getSessionLengthMin(session)
  return pixPerMin * minDiff
}

const getTop = (sessionStartTime: Date, pixPerMin: number, barStartTime: Date) => {
  return pixPerMin * getMinDiff(barStartTime, sessionStartTime)
}

const getMiddle = (session: Session | SessionWithAchievedGoals, pixPerMin: number, barStartTime: Date) => {
  return pixPerMin * getMinDiff(barStartTime, session.startTime) + getHeight(session, pixPerMin) * 0.5 - 20
}

const getMiddleForCurSession = (startedTime: Date, pixPerMin: number, barStartTime: Date) => {
  const curLengthMilliS = curDate().getTime() - startedTime.getTime();
  const curLengthMinutes = curLengthMilliS / 1000 / 60;
  return pixPerMin * getMinDiff(barStartTime, startedTime) + curLengthMinutes * pixPerMin * 0.5 - 20
}

const getTopForHourAnnotation = (h: number, pixPerMin: number, barStartTime: Date) => {
  const hourDate = curDate()
  hourDate.setHours(h)
  hourDate.setMinutes(0)
  hourDate.setSeconds(0)
  return pixPerMin * getMinDiff(barStartTime, hourDate) - 10
}

export const RecordsBar = () => {
  const [todayDoneSessionList, setTodayDoneSessionList] = useRecoilState(todayDoneSessionListState)

  const [barEndTime, setBarEndTime] = useState<Date>(getBarEndTime);
  useEffect(() => {
    getTodaySessionsWithAchievedGoals().then((sessionsWithGoals) => {
      setTodayDoneSessionList(sessionsWithGoals)
    })

    const timer = setInterval(() => {
      setBarEndTime(getBarEndTime());
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const curSessionStartTime = useRecoilValue(currentStartTimeState)
  let barStartTime: Date;
  if (todayDoneSessionList.length > 0) {
    barStartTime = todayDoneSessionList[0].startTime;
  } else if (curSessionStartTime != null) {
    barStartTime = curSessionStartTime
  } else {
    barStartTime = curDate()
  }

  const minutesLengthInBar = getMinDiff(barStartTime, barEndTime)
  const barLengthPixel = 720;
  const pixPerMin = barLengthPixel / minutesLengthInBar;

  const startTimeDisplay = barStartTime.getHours() + ":" + padZero(barStartTime.getMinutes())

  let hours = Array.from({length: 24}, (_, index) => index);
  hours = hours.filter(num => barStartTime.getHours() < num && num <= barEndTime.getHours());

  const [focusedDoneSession, setFocusedDoneSession] = useState(-1);
  const [isCurrentSessionHovered, setIsCurrentSessionHovered] = useState(false);
  const seconds = useRecoilValue(secondsState)
  const settings = useRecoilValue(timerConfigState)
  const curDurationType = useRecoilValue(currentDurationTypeState)
  const curAchievedMissions = useRecoilValue(curAchievedGoalsState)

  return (
      <div className="graph-container">
        <div className="records-bar">
          {
            barStartTime.getMinutes() < 50 ?
                <div className="startTime">{startTimeDisplay}</div> :
                <></>
          }

          {
            hours.map((h) => (
                <div className="hours-annotation"
                     style={{top: getTopForHourAnnotation(h, pixPerMin, barStartTime)}}>
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
                         top: getTop(session.startTime, pixPerMin, barStartTime),
                         height: getHeight(session, pixPerMin),
                         width: index === focusedDoneSession ? 25 : 20,
                         right: index === focusedDoneSession ? -2.5 : 0,
                       }}></div>
                  {focusedDoneSession === index ?
                      <div className="focusedDoneSession" style={{
                        position: "absolute",
                        top: getMiddle(session, pixPerMin, barStartTime),
                      }}>{DoneSessionSummary(session)}</div> :
                      <></>
                  }
                </>
            ))
          }

          {
            <>
              {curSessionStartTime !== null && curDurationType === DurationType.Focus ?
                  <>
                  <div className={"doneSession"}
                       onMouseEnter={() => {
                         setIsCurrentSessionHovered(true)
                       }}
                       onMouseLeave={() => {
                         setIsCurrentSessionHovered(false)
                       }}
                       style={{
                         position: "absolute",
                         top: getTop(curSessionStartTime, pixPerMin, barStartTime),
                         height: pixPerMin * (settings.focusLength - (seconds / 60)),
                         width: isCurrentSessionHovered ? 25 : 20,
                         right: isCurrentSessionHovered ? -2.5 : 0,
                         zIndex: 1,
                       }}></div>
                      <div className="focusedDoneSession" style={{
                        position: "absolute",
                        top: getMiddleForCurSession(curSessionStartTime, pixPerMin, barStartTime),
                        display: isCurrentSessionHovered ? "block" : "none",
                      }}>{OngoingSessionSummary(curSessionStartTime, curAchievedMissions)}</div>
                  </>
                  :
                  <></>
              }

            </>
          }

        </div>
        <div className="total-minutes">
          <p>total {displayedMinutes(sessionMinutesSum(todayDoneSessionList))}</p>
        </div>
      </div>
  )
}

const OngoingSessionSummary = (curSessionStartTime: Date, achievedGoals: Goal[]) => {
  const start_h = curSessionStartTime.getHours()
  const start_m = padZero(curSessionStartTime.getMinutes())

  return (
      <>
        <p>ongoing from {start_h}:{start_m}</p>
        {
          achievedGoals.length > 0 ?
              achievedGoals.map((goal, index) => (
                  <li key={index}>{goal.statement}</li>
              ))
              :<></>
        }
      </>
  )
}

const DoneSessionSummary = (session: SessionWithAchievedGoals) => {
  const start = session.startTime
  const start_h = start.getHours()
  const start_m = padZero(start.getMinutes())

  const end = session.endTime
  const end_h = end.getHours()
  const end_m = padZero(end.getMinutes())

  return (
      <>
        <p>{start_h}:{start_m} - {end_h}:{end_m} (actual: {getActualFocusMinutes(session)}m)</p>
        {
          session.achievedGoals.length > 0 ?
          session.achievedGoals.map((goal, index) => (
              <li key={index}>{goal.statement}</li>
          ))
              :<></>
        }
      </>
  );
}
