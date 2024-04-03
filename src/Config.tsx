import {useLocalStorage} from "./LocalStorage.tsx";
import Header from "./Header.tsx";

export default function Settings() {
    const [sessionLength, setSessionLength] = useLocalStorage("sessionLength", "25");

    return (
        <>
            <Header/>
            <label htmlFor="length">length</label>
            <input id="length" value={sessionLength} onChange={(event) => setSessionLength(() => event.target.value)}/>
        </>
    )
}