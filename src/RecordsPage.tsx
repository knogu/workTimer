import "./RecordsPage.css"

import {RecordsBar} from "./RecordsBar.tsx";
import Header from "./Header.tsx";

export default function RecordsPage() {
  const getDateString = () => {
    const today = new Date();
    return (today.getMonth() + 1).toString() + "/" + today.getDate().toString()
  }

  return (
      <>
      <Header/>
        <div className="dateChoiceBlock">
          {getDateString()}
        </div>

      <div className="graph-container">
        {RecordsBar()}
      </div>
      </>
  )
}
