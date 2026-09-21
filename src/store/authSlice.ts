import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types/types';

const savedUser = localStorage.getItem('user');
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!parsedUser,
    isLoading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;

        localStorage.setItem('user', JSON.stringify(action.payload));
        },

        clearUser: (state) => {
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem('user');
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
        }
    }
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;