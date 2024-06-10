import "./Achievements.css"

import {useEffect} from "react";
import {getAllGoals} from "./types/goal.ts";
import {useRecoilState} from "recoil";
import {todayAchievedGoalsState} from "./state.ts";

export default function AchievedGoals() {
  const [goals, setGoals] = useRecoilState(todayAchievedGoalsState)

  useEffect(() => {
    getAllGoals().then(goals => setGoals(goals))
  }, []);

  return (
      <div className="achieved-goals">
        {goals.length > 0 ?
            goals.map((item, index) => (
                <li key={index}>{item.statement}</li>
            ))
            :<></>
        }
      </div>
  )
}
