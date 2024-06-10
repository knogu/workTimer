import "./Achievements.css"

import {useEffect, useState} from "react";
import {getAllGoals, Goal} from "./types/goal.ts";

export default function AchievedGoals() {
  const [goals, setGoals] = useState<Goal[]>([])

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
