import './Config.css'
import {useRecoilState} from "recoil";
import {settingsState} from "./state.ts";
import Header from "./Header.tsx";
import {putSettings, timerConfig} from "./types/timerConfig.ts";

export default function SettingsPage() {
    const [settings, setSettings] = useRecoilState(settingsState);

    const onSettingsChange = (newSettings: timerConfig) => {
        setSettings(newSettings)
        putSettings('1', newSettings)
    }

    return (
        <>
            <Header/>
            <div className="settings-container">
                <div className="config-item">
                    <label htmlFor="length">focus</label>
                    <input id="length" value={settings.focusLength} type="number"
                           onChange={(event) => {onSettingsChange({...settings, focusLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="short-break">short break</label>
                    <input id="short-break" value={settings.shortBreakLength} type="number"
                           onChange={(event) => {onSettingsChange({...settings, shortBreakLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="long-break">long break</label>
                    <input id="long-break" value={settings.longBreakLength} type="number"
                           onChange={(event) => {onSettingsChange({...settings, longBreakLength: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="session-cnt">session count before long break</label>
                    <input id="session-cnt" value={settings.focusCntBeforeLongBreak} type="number"
                           onChange={(event) => {onSettingsChange({...settings, focusCntBeforeLongBreak: parseInt(event.target.value)})}}/>
                </div>

                <div className="config-item">
                    <label htmlFor="goal">goal</label>
                    <input id="goal" value={settings.goalMinutes} type="number"
                           onChange={(event)=> {onSettingsChange({...settings, goalMinutes: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="userId">userId</label>
                    <input id="userId" value={settings.userId} type="number"
                           onChange={(event)=> {onSettingsChange({...settings, userId: parseInt(event.target.value)})}}/>
                </div>
            </div>
        </>
    )
}
