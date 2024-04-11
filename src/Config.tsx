import './Config.css'
import {putSettings, Settings} from "./types/session.ts";

export default function SettingsPage() {
    // todo: recoil

    return (
        <>
            <div className="settings-container">
                <div className="config-item">
                    <label htmlFor="length">length</label>
                    <input id="length" value={settings.sessionLengthMin}
                           onChange={(event) => {onSettingsChange({...settings, sessionLengthMin: parseInt(event.target.value)})}}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="goal">goal</label>
                    <input id="goal" value={settings.goalMinutes}
                           onChange={(event)=> {onSettingsChange({...settings, goalMinutes: parseInt(event.target.value)})}}/>
                    min
                </div>
            </div>
        </>
    )
}
