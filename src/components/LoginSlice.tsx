import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LoginState {
    password: string;
    username: string;
    isLoading: boolean;
    error: string;
    isLoggedIn: boolean;
}

export const initialState: LoginState = {
    password: "",
    username: "",
    isLoading: false,
    error: "",
    isLoggedIn: false
};

export type LoginAction =
{ type: "login" | "success" | "error" | "logout" }
| { type: "field"; fieldName: string; payload: string };

export const loginSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        "loginAction": (state) => {
            state.isLoggedIn = true
        },
        "logoutAction": (state) => {
            state.isLoggedIn = false
        },
        "errorAction": (state, action:PayloadAction<string>) => {
            state.error = action.payload
         },
         "stateAction": (state) => {
            console.log(current(state));
         }
    },
  })
  
export const { loginAction, logoutAction, errorAction, stateAction } = loginSlice.actions
  
export default loginSlice.reducer