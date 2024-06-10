import "./Goals.css"

import {useState} from "react";
import {useRecoilState} from "recoil";
import {curAchievedGoalIdsState} from "./state.ts";
import {addGoal, Goal} from "./types/goal.ts";

export const Goals = () => {
  const [curGoal, setGoal] = useState<string>("");
  const [curAchievedGoalIds, setAchievedGoalIds] = useRecoilState(curAchievedGoalIdsState);

  const onGoalAchieved = () => {
    const achievedGoal: Goal = {
      statement: curGoal
    }
    addGoal(achievedGoal).then(id =>
        setAchievedGoalIds([...curAchievedGoalIds, id])
    )
    setGoal("");
  }

  return (
              <div className="goal-section">
                <h1>Small Goal</h1>
                <input id="goal" value={curGoal}
                       onChange={(event) => {setGoal(event.target.value)}}
                       placeholder={"what you want to finish in the current or next focus"}
                />
                <div>
                  <button className="completed-button" onClick={onGoalAchieved} disabled={curGoal === ""}> completed
                    {/*<i className="fa fa-solid fa-check"></i>*/}
                  </button>
                </div>
              </div>
  )
}
