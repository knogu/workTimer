import Header from "./Header.tsx";
import {RecordsBar} from "./RecordsBar.tsx";
import {Timer} from "./Timer.tsx";

export const TimerPage = () => {
  return (
      <>
        <Header />
        <div className="contents">
          <RecordsBar/>
          <Timer/>
        </div>
      </>
  )
}
