import React, { useState } from 'react'
import type { RootState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import { loginAction, errorAction, LoginState, update } from './LoginSlice'
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';

export default function LoginForm() {
    const isLoggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn)
    const dispatch = useDispatch()
    const [state, setState] = useState(
      {username:"",
      password:"", 
      isLoading:false, 
      isLoggedIn:isLoggedIn, 
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
      try {
        await AuthService.loginAction({ username:state.username, password:state.password })
        dispatch(loginAction())
        //can use line below if wanting to keep user creds in redux store
        // dispatch(update({...state, isLoggedIn:true}))
      } catch (error) {
        //use line below if redux store needs to hold error
        // dispatch(errorAction("Login Failed. Invalid credentials"));
        setState({...state, error:"Login Failed! Invalid credentials"});
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