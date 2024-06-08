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
        {
              <div className="">
                <label htmlFor="goal">mission</label>
                <input id="goal" value={curGoal}
                       onChange={(event) => {setGoal(event.target.value)}}/>
                <button className="timer-button" onClick={onGoalAchieved}><i className="fa fa-solid fa-check"></i></button>
              </div>
        }
      </>
  )
}
