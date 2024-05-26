import Dexie from "dexie";

export type Session = {
    startTime: Date;
    endTime: Date;
    pauseDurations: PauseDuration[];
}

export type PauseDuration = {
    pauseStart: Date;
    pauseEnd: Date;
}

class Database extends Dexie {
    public sessions: Dexie.Table<Session, number>
    public settings: Dexie.Table<Settings, number>

    public constructor() {
        super('Database');
        this.version(1).stores({
            sessions: '++id, startTime, endTime, stoppingDurations',
            settings: '++id, sessionLengthMin, goalMinutes',
        });
        this.sessions = this.table('sessions')
        this.settings = this.table('settings')
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
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        return await db.table('sessions')
            .where('startTime')
            .aboveOrEqual(startOfDay)
            .toArray().then((ls) => ls.sort((a:Session, b:Session) => a.startTime.getTime() - b.startTime.getTime()));
    } catch (error) {
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

export const sessionMinutesSum = (sessions: Session[]) => {
    let totalMilliSec = 0
    for (const session of sessions) {
        totalMilliSec += session.endTime.getTime() - session.startTime.getTime()
    }
    return Math.floor(totalMilliSec / (1000 * 60))
}

export async function getTodayTotalMinutes(): Promise<number> {
    return sessionMinutesSum(await getTodaySessions())
}

export const getSessionLengthMin = (session: Session) => {
    const diffInMilliseconds: number = session.endTime.getTime() - session.startTime.getTime();
    return diffInMilliseconds / (1000 * 60);
}

export const getMinDiff = (earlier: Date, later: Date) => {
    const diffInMilliseconds: number = later.getTime() - earlier.getTime();
    return diffInMilliseconds / (1000 * 60);
}

export type Settings = {
    id: number;
    sessionLengthMin: number;
    goalMinutes: number;
    userId: number | undefined;
}

export async function putSettings(settings: Settings) {
    return db.settings.put({ ...settings, id: 1})
}

export async function getSettings() {
    return db.settings.get(1).then((res) => {
            if (res === undefined) {
                const newSetting = {sessionLengthMin: 25, goalMinutes: 360, id:1, userId: undefined}
                putSettings(newSetting)
                return newSetting
            } else {
                return res!
            }
        }
    )
}
