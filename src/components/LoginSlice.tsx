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

export const loginSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        "update": (state, action:PayloadAction<LoginState>) => {
            state.username = action.payload.username;
            state.password = action.payload.password; 
            state.isLoading = action.payload.isLoading; 
            state.isLoggedIn = action.payload.isLoggedIn; 
            state.error = action.payload.error;
        },
        "loginAction": (state) => {
            state.isLoggedIn = true;
            state.error = "";
        },
        "logoutAction": (state) => {
            state.isLoggedIn = false;
            state.error = "";
        },
        "errorAction": (state, action:PayloadAction<string>) => {
            state.error = action.payload;
         },
         "stateAction": (state) => {
            console.log(current(state));
         }
    },
  })
  
export const { loginAction, logoutAction, errorAction, stateAction, update } = loginSlice.actions
  
export default loginSlice.reducer