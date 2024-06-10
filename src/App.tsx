import Header from "./Header.tsx";
import {RecordsBar} from "./RecordsBar.tsx";
import {Timer} from "./Timer.tsx";
import {Goals} from "./Goals.tsx";
import AchievedGoals from "./Achievements.tsx";

export const TimerPage = () => {
  return (
      <>
        <Header />
        <div className="contents">
          <div className="left-contents">
            <RecordsBar/>
          </div>

          <div className="right-contents">
            <Timer/>
            <Goals/>
            <AchievedGoals/>
          </div>
        </div>
      </>
  )
}
