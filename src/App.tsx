import './App.css';
import Login from "./components/LoginPage";
import Home from "./components/HomePage";
import Quiz from "./components/QuizPage"
import { Component } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

type Props = {};

type State = {
  currentUser: undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

logOut() {
  // AuthService.logout();
  this.setState({
    currentUser: undefined
  });
}

render() {
  const { currentUser} = this.state;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={ <Home/> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/quiz" element={ <Quiz/> } />
          <Route path="*" element={ <Navigate to='/home'></Navigate>} />
        </Routes>
      </BrowserRouter>
    </div>
    );
  }
}

export default App;
