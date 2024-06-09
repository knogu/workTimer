import "./Goals.css"

import {useState} from "react";
import {useRecoilState} from "recoil";
import {curAchievedMissionsState} from "./state.ts";

export const Goals = () => {
  const [curGoal, setGoal] = useState("");
  const [curAchivedGoals, setAchievedGoals] = useRecoilState(curAchievedMissionsState);

  const onGoalAchieved = () => {
    setAchievedGoals([...curAchivedGoals, curGoal]);
    setGoal("");
  }

  return (
      <>
        <h1>Small Goal</h1>
        {
              <div className="goal-section">
                <input id="goal" value={curGoal}
                       onChange={(event) => {setGoal(event.target.value)}}
                       placeholder={"what you want to finish in the current or next focus"}
                />
                <div>
                  <button className="completed-button" onClick={onGoalAchieved}> completed
                    {/*<i className="fa fa-solid fa-check"></i>*/}
                  </button>
                </div>
              </div>
        }
      </>
  )
}
