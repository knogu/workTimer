import Dexie from 'dexie';
import {curDate} from "../Util.ts";

export type Goal = {
  id?: number;
  statement: string;
  achievedTimestamp: Date;
};

class GoalDatabase extends Dexie {
  goals: Dexie.Table<Goal, number>;

  constructor() {
    super("GoalDatabase");
    this.version(2).stores({
      goals: '++id, statement, achievedTimestamp'
    });

    this.goals = this.table("goals");
  }
}

export async function addGoal(goal: Goal): Promise<number> {
  return goalDB.goals.add(goal);
}

export async function getGoal(id: number): Promise<Goal | undefined> {
  return goalDB.goals.get(id);
}

export async function updateGoal(id: number, changes: Partial<Goal>): Promise<number> {
  return goalDB.goals.update(id, changes);
}

export async function deleteGoal(id: number): Promise<void> {
  await goalDB.goals.delete(id);
}

export async function getAllGoals(): Promise<Goal[]> {
  return goalDB.goals.toArray();
}

export async function getGoalsAchievedToday(date: Date = curDate()): Promise<Goal[]> {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  return goalDB.goals
      .where('achievedTimestamp')
      .between(startOfDay, endOfDay)
      .toArray();
}

export const goalDB = new GoalDatabase();
