import React, { useState } from 'react'
import type { RootState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import { loginAction, errorAction, LoginState } from './LoginSlice'
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';

type LoginAction =
  | { type: "login" | "success" | "error" | "logout" }
  | { type: "field"; fieldName: string; payload: string };

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload
      };
    }
    case "login": {
      return {
        ...state,
        error: "",
        isLoading: true
      };
    }
    case "success": {
      return { ...state, error: "", isLoading: false, isLoggedIn: true };
    }
    case "error": {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        username: "",
        password: "",
        error: "Incorrect username or password!"
      };
    }
    case "logout": {
      return {
        ...state,
        isLoggedIn: false
      };
    }
    default:
      return state;
  }
};

export default function LoginForm() {
    const isLoggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn)
    const dispatch = useDispatch()
    const [state, setState] = useState(
      {username:"",
      password:"", 
      isLoading:false, 
      isLoggedIn, 
      error:""});
    
    //handle state changes on form inputs
    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
      const {id , value} = e.currentTarget
      setState(prevState => ({
          ...prevState,
          [id] : value
      }))
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(e)
      try {
        await AuthService.loginAction({ username:state.username, password:state.password })
        .then(()=>
        {dispatch(loginAction())}
        );
      } catch (error) {
        dispatch(errorAction("login failed"));
      }
    };
  
    return (
      <div className="App">
        <div className="login-container">
          {isLoggedIn ? (
            <Navigate to="/quiz"></Navigate>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              {state.error && <p className="error">{state.error}</p>}
              <p> Login </p>
              <input
                id="username"
                type="text"
                placeholder="username"
                value={state.username}
                onChange={changeHandler}
              />
              <input   
                id="password"
                type="password"
                placeholder="password"
                autoComplete="new-password"
                value={state.password}
                onChange={changeHandler}
              />
              <button type="submit" className="submit" disabled={state.isLoading}>
                {state.isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </div>
        <br></br>
        <hr></hr>
        <p>Username: test </p>
        <p> Password: test</p>
      </div>
    );
  }