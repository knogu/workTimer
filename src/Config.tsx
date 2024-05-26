import './Config.css'
import {putSettings, Settings} from "./types/session.ts";
import {useRecoilState} from "recoil";
import {settingsState} from "./state.ts";
import Header from "./Header.tsx";

export default function SettingsPage() {
    const [settings, setSettings] = useRecoilState(settingsState);

    const onSettingsChange = (newSettings: Settings) => {
        setSettings(newSettings)
        putSettings(newSettings)
    }

    return (
        <>
            <Header/>
            <div className="settings-container">
                <div className="config-item">
                    <label htmlFor="length">length</label>
                    <input id="length" value={settings.sessionLengthMin} type="number"
                           onChange={(event) => {onSettingsChange({...settings, sessionLengthMin: parseInt(event.target.value)})}}/>
                    min
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
