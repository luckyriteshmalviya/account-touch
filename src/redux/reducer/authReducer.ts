import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    profile: null
  } as any
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  
    setUserProfile: (state, action) => {
      state.user.profile = action.payload;
    },
    setUpdateUserSettings: (state, action) => {
      if (state.user?.profile?.settings && Object.keys(action.payload).length > 0) {
        for (const key in action.payload) {
          if (typeof state.user.profile.settings[key] !== "undefined") {
            state.user.profile.settings[key] = action.payload[key];
          }
        }
      }
    },
    logout: (state) => {
      state.user.profile = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserProfile, logout, setUpdateUserSettings } = authSlice.actions;

export default authSlice.reducer;
