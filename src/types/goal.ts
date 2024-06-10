import Dexie from 'dexie';

export type Goal = {
  id?: number;
  statement: string;
  // sessionIdWhenAchieved: Date;
};

class GoalDatabase extends Dexie {
  goals: Dexie.Table<Goal, number>;

  constructor() {
    super("GoalDatabase");
    this.version(1).stores({
      goals: '++id, statement, sessionIdWhenAchieved'
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

export const goalDB = new GoalDatabase();
