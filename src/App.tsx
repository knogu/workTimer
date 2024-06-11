import Header from "./Header.tsx";
import {RecordsBar} from "./RecordsBar.tsx";
import {Timer} from "./Timer.tsx";
import {Goals} from "./Goals.tsx";
import AchievedGoals from "./Achievements.tsx";
import {useEffect} from "react";

export const TimerPage = () => {

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    // todo: prevent only when focus is ongoing
    e.preventDefault();
    e.returnValue = "Fine to leave page ?";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
