import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types/types';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        },

        clearUser: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
        }
    }
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;