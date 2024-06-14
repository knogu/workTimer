import Dexie from "dexie";
import {curDate} from "../Util.ts";
import {getGoalsByIds, Goal} from "./goal.ts";

export type Session = {
    startTime: Date;
    endTime: Date;
    pauseDurations: PauseDuration[];
    achievedMissionIds: number[];
}

export type SessionWithAchievedGoals = {
    startTime: Date;
    endTime: Date;
    pauseDurations: PauseDuration[];
    achievedGoals: Goal[];
}

export type PauseDuration = {
    pauseStart: Date;
    pauseEnd: Date;
}

class Database extends Dexie {
    public sessions: Dexie.Table<Session, number>

    public constructor() {
        super('Database');
        this.version(3).stores({
            sessions: '++id, startTime, endTime, stoppingDurations',
        });
        this.sessions = this.table('sessions')
    }
}

const db = new Database();

export async function addSessionToDb(session: Session) {
    try {
        await db.sessions.add(session);
    } catch (error) {
        console.error(error);
    }
}

export async function getAllSessions(): Promise<Session[]> {
    try {
        return await db.sessions.toArray();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getTodaySessions(): Promise<Session[]> {
    try {
        const startOfDay = curDate();
        startOfDay.setHours(0, 0, 0, 0);

        return await db.table('sessions')
            .where('startTime')
            .aboveOrEqual(startOfDay)
            .toArray()
            .then((ls) => ls.sort((a:Session, b:Session) => a.startTime.getTime() - b.startTime.getTime()));
    } catch (error) {
        return [];
    }
}

export async function getTodaySessionsWithAchievedGoals(): Promise<SessionWithAchievedGoals[]> {
    try {
        const startOfDay = curDate();
        startOfDay.setHours(0, 0, 0, 0);

        const sessions = await db.table('sessions')
            .where('startTime')
            .aboveOrEqual(startOfDay)
            .toArray();

        const sessionsWithGoals = await Promise.all(sessions.map(async (session) => {
            const achievedGoals = await getGoalsByIds(session.achievedMissionIds);
            return {
                ...session,
                achievedGoals: achievedGoals
            };
        }));

        return sessionsWithGoals.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getTotalMinutes(): Promise<number> {
    const allSessions = await getAllSessions()
    let totalMilliSec = 0
    for (const session of allSessions) {
        totalMilliSec += session.endTime.getTime() - session.startTime.getTime()
    }
    return Math.floor(totalMilliSec / (1000 * 60))
}

export const sessionMinutesSum = (sessions: Session[] | SessionWithAchievedGoals[]) => {
    let totalMilliSec = 0
    for (const session of sessions) {
        totalMilliSec += session.endTime.getTime() - session.startTime.getTime()
    }
    return Math.floor(totalMilliSec / (1000 * 60))
}

export async function getTodayTotalMinutes(): Promise<number> {
    return sessionMinutesSum(await getTodaySessions())
}

export const getSessionLengthMin = (session: Session | SessionWithAchievedGoals) => {
    const diffInMilliseconds: number = session.endTime.getTime() - session.startTime.getTime();
    return diffInMilliseconds / (1000 * 60);
}

export const getMinDiff = (earlier: Date, later: Date) => {
    const diffInMilliseconds: number = later.getTime() - earlier.getTime();
    return diffInMilliseconds / (1000 * 60);
}

