import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our user state
interface UserState {
  username: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  username: 'Guest',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Standard reducer without a payload
    logout: (state) => {
      state.username = 'Guest';
      state.isLoggedIn = false;
    },
    // Reducer using PayloadAction to strictly type the incoming data
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isLoggedIn = true;
    },
  },
});

export const { logout, setUsername } = userSlice.actions;
export default userSlice.reducer;