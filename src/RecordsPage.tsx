import "./RecordsPage.css"

import {RecordsBar} from "./RecordsBar.tsx";
import Header from "./Header.tsx";
import {curDate} from "./Util.ts";

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

        <RecordsBar />
      </>
  )
}
