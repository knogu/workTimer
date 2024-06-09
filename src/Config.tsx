import './Config.css'
import {useRecoilState} from "recoil";
import {timerConfigState} from "./state.ts";
import Header from "./Header.tsx";
import {save, TimerConfig} from "./types/timerConfig.ts";

export default function SettingsPage() {
    const [timerConfig, setTimerConfig] = useRecoilState(timerConfigState);

    const onSettingsChange = (newSettings: TimerConfig) => {
        setTimerConfig(newSettings)
        save(newSettings)
    }

    return (
        <>
            <Header/>
            <div className="settings-container">
                <div className="config-item">
                    <label htmlFor="length">focus</label>
                    <input id="length" value={timerConfig.focusLength} type="number"
                           onChange={(event) => {onSettingsChange({...timerConfig, focusLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="short-break">short break</label>
                    <input id="short-break" value={timerConfig.shortBreakLength} type="number"
                           onChange={(event) => {onSettingsChange({...timerConfig, shortBreakLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="long-break">long break</label>
                    <input id="long-break" value={timerConfig.longBreakLength} type="number"
                           onChange={(event) => {onSettingsChange({...timerConfig, longBreakLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="session-cnt">session count before long break</label>
                    <input id="session-cnt" value={timerConfig.focusCntBeforeLongBreak} type="number"
                           onChange={(event) => {onSettingsChange({...timerConfig, focusCntBeforeLongBreak: parseInt(event.target.value)})}}/>
                </div>

                <div className="config-item">
                    <label htmlFor="goal">goal</label>
                    <input id="goal" value={timerConfig.goalMinutesPerDay} type="number"
                           onChange={(event)=> {onSettingsChange({...timerConfig, goalMinutesPerDay: parseInt(event.target.value)})}}/>
                    min
                </div>
            </div>
        </>
    )
}
