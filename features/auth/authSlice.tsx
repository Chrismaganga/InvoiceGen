import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_details: null,
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.user_details = action.payload;
    },
    clearUserDetails(state) {
      state.user_details = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = authSlice.actions;

export default authSlice.reducer;
export interface AuthState {
  user_details: {
    _id: string;
    name: string;
    email: string;
  } | null;
}