import {atom, selector} from "recoil";
import {
    PauseDuration,
    Session,
    sessionMinutesSum,
} from "./types/session.ts";

import {
    DurationType,
    timerConfig
} from "./types/timerConfig.ts";
import {curDate} from "./Util.ts";

const initTimerConfig: timerConfig = {
    focusCntBeforeLongBreak: 4, focusLength: 25, goalMinutesPerDay: 120, longBreakLength: 20, shortBreakLength: 5
};

export const timerConfigState = atom({
    key: "timerConfigState",
    default: initTimerConfig
})

const expiryTimestamp = curDate();
expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 25 * 60);

export const expiryState = atom({
    key: "expiryState",
    default: expiryTimestamp
})

export const secondsState = atom({
    key: "secondsState",
    default: 25 * 60
})

export const userIdState = atom<number|null>({
    key: "userIdState",
    default: null
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

export const currentDurationTypeState = atom<DurationType>({
    key: "durationTypeState",
    default: DurationType.Focus
})

export const curPauseTimeState = atom<Date | null>({
    key: "currentPauseTimeState",
    default: null
})

export const curPauseDurationsState = atom<PauseDuration[]>({
    key: "pauseDurationsInCurSessionState",
    default: []
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
