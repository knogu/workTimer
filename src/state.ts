import {atom, selector} from "recoil";
import {
    PauseDuration,
    Session,
    sessionMinutesSum,
} from "./types/session.ts";

import {
    DurationType,
    TimerConfig
} from "./types/timerConfig.ts";
import {curDate} from "./Util.ts";
import {Goal} from "./types/goal.ts";

const initTimerConfig: TimerConfig = await TimerConfig.load();

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

export const curAchievedGoalIdsState = atom<number[]>({
    key: "curAchievedGoalIds",
    default: []
})

export const todayDoneSessionListState = atom<Session[]>({
    key: "todayDoneSessionListState",
    default: []
})

export const todayAchievedGoalsState = atom<Goal[]>({
    key: "setTodayAchievedGoals",
    default: []
})

export const todayTotalMinutesSelector = selector({
    key: "todayTotalMinutesSelector",
    get: ({ get }) => {
        return sessionMinutesSum(get(todayDoneSessionListState))
    }
})
