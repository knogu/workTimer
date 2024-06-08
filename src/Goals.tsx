import {useState} from "react";

export const Goals = () => {
  const [curGoal, setGoal] = useState("");
  return (
      <>
        {
              <div className="">
                <label htmlFor="goal">mission in this or next session</label>
                <input id="goal" value={curGoal}
                       onChange={(event) => {setGoal(event.target.value)}}/>
                <button className="timer-button" onClick={()=>{setGoal("")}}><i className="fa fa-solid fa-check"></i></button>
              </div>
        }
      </>
  )
}
