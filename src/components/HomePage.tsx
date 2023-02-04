import "./../styles.css";
import {Link} from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>This is the Home page</h1>
            <Link to="/login">Login</Link>
            <br></br>
            <Link to="/quiz">Quiz</Link>
        </div>
    )
}

export default Home;