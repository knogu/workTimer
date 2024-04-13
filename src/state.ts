import {atom, selector} from "recoil";
import {Session, sessionMinutesSum, Settings} from "./types/session.ts";
import {amplifyIfProdEnv} from "./Util.ts";

const initSettings: Settings = {sessionLengthMin: 25, goalMinutes: 360, id: 1};

export const settingsState = atom({
    key: "settingsState",
    default: initSettings
})


const expiryTimestamp = new Date();
expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + amplifyIfProdEnv(25));

export const expiryState = atom({
    key: "expiryState",
    default: expiryTimestamp
})

export const secondsState = atom({
    key: "secondsState",
    default: 25 * 60
})

export const isRunningState = atom({
    key: "isRunningState",
    default: false
})

export const didStartState = atom({
    key: "didStartState",
    default: false
})

export const currentStartTimeState = atom<Date | null>({
    key: "currentStartTimeState",
    default: null
})

export const todayDoneSessionListState = atom<Session[]>({
    key: "todayDoneSessionListState",
    default: []
})

export const todayTotalMinutesSelector = selector({
    key: "todayTotalMinutesSelector",
    get: ({ get }) => {
        return sessionMinutesSum(get(todayDoneSessionListState))
    }
})
