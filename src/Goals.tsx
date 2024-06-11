import "./Goals.css"

import {useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {curAchievedGoalIdsState, todayAchievedGoalsState} from "./state.ts";
import {addGoal, Goal} from "./types/goal.ts";

export const Goals = () => {
  const [curGoal, setGoal] = useState<string>("");
  const [curAchievedGoalIds, setAchievedGoalIds] = useRecoilState(curAchievedGoalIdsState);
  const [isGoalBeingWritten, setIsGoalBeingWritten] = useState(false);
  const [isGoalHovered, setIsGoalHovered] = useState(false);
  const setTodayAchievedGoals = useSetRecoilState(todayAchievedGoalsState);

  const onGoalAchieved = () => {
    const achievedGoal: Goal = {
      statement: curGoal
    }
    addGoal(achievedGoal).then(id =>
        setAchievedGoalIds([...curAchievedGoalIds, id])
    )
    setTodayAchievedGoals(cur => [...cur, achievedGoal])
    setGoal("");
  }

  const onCheckClicked = () => {
    setIsGoalBeingWritten(false);
  }

  return (
              <div className="goal-section">
                <h1>Small Goal</h1>
                <div className="goal-input-form">
                  <input id="goal" value={curGoal}
                         onChange={(event) => {setGoal(event.target.value)}}
                         placeholder={"Click here to input your small goal"}
                         onFocus={() => setIsGoalBeingWritten(true)}
                         onBlur={() => setIsGoalBeingWritten(false)}
                         onMouseEnter={() => setIsGoalHovered(true)}
                         onMouseLeave={() => setIsGoalHovered(false)}
                         style = {{height: '100%',
                           width: '100%',
                           borderTop: 'none',
                           borderRight: 'none',
                           borderLeft: 'none',
                           borderBottom: curGoal === "" || isGoalHovered ? '2px solid gray' : 'none',
                         }}
                  />
                  {
                    isGoalBeingWritten ?
                        <button className="goal-input-done" onClick={onCheckClicked}>Apply</button>
                        :<></>
                  }
                </div>
                <div>
                  <button className="completed-button" onClick={onGoalAchieved} disabled={curGoal === ""}> Achieved 🎉
                  </button>
                </div>
              </div>
  )
}
