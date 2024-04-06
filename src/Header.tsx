import './Header.css';
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="container">
                <div>
                    <Link to="/" className="top-link">workTimer</Link>
                </div>
                <div>
                    <Link to="/settings">settings</Link>
                </div>
                <div>
                    <Link to="/records">records(graph)</Link>
                </div>
                <div>
                    <Link to="/records-text">records(text)</Link>
                </div>
            </div>
        </header>
    )
}