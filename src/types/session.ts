import Dexie from "dexie";

export type Session = {
    startTime: Date;
    endTime: Date;
}

class Database extends Dexie {
    public sessions: Dexie.Table<Session, number>;

    public constructor() {
        super('Database');
        this.version(1).stores({
            sessions: '++id, startTime, endTime',
        });
        this.sessions = this.table('sessions');
    }
}

const db = new Database();

export async function addSession(session: Session) {
    try {
        await db.sessions.add(session);
        console.log("added")
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

export async function getTotalMinutes(): Promise<number> {
    const allSessions = await getAllSessions()
    let totalMilliSec = 0
    for (const session of allSessions) {
        totalMilliSec += session.endTime.getTime() - session.startTime.getTime()
    }
    return Math.floor(totalMilliSec / (1000 * 60))
}

export const getSessionLengthMin = (session: Session) => {
    const diffInMilliseconds: number = session.endTime.getTime() - session.startTime.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60));
}

export const getMinDiff = (earlier: Date, later: Date) => {
    const diffInMilliseconds: number = later.getTime() - earlier.getTime();
    return diffInMilliseconds / (1000 * 60);
}

export const getHeight = (session: Session) => {
    const minDiff = getSessionLengthMin(session)
    return Math.floor(60 * minDiff / 60)
}

export const getTop = (session: Session) => {
    return getMinDiff(new Date(2024, 3, 6, 8, 0), session.startTime)
}
