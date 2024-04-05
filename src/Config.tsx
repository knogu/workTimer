import './Config.css'
import {useLocalStorage} from "./LocalStorage.tsx";
import Header from "./Header.tsx";

export default function Settings() {
    const [sessionLength, setSessionLength] = useLocalStorage("sessionLength", "25");
    const [goalMinutes, setGoalMinutes] = useLocalStorage("goalMinutes", "360");

    return (
        <>
            <Header/>
            <div className="settings-container">
                <div className="config-item">
                    <label htmlFor="length">length</label>
                    <input id="length" value={sessionLength}
                           onChange={(event) => setSessionLength(() => event.target.value)}/>
                    min
                </div>

                <div className="config-item">
                    <label htmlFor="goal">goal</label>
                    <input id="goal" value={goalMinutes}
                           onChange={(event) => setGoalMinutes(() => event.target.value)}/>
                    min
                </div>
            </div>
        </>
    )
}