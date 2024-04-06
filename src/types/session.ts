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
