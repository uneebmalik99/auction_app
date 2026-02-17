import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../utils/types';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    // Toggle a favorite vehicle ID on the logged-in user
    toggleFavorite(state, action: PayloadAction<string>) {
      if (!state.user) {
        return;
      }
      const id = action.payload;
      const current = state.user.favorites ?? [];
      if (current.includes(id)) {
        state.user.favorites = current.filter(existingId => existingId !== id);
      } else {
        state.user.favorites = [...current, id];
      }
    },
    clearFavorites(state) {
      if (state.user) {
        state.user.favorites = [];
      }
    },
  },
});

export const { setUser, clearUser, toggleFavorite, clearFavorites } =
  profileSlice.actions;

export default profileSlice.reducer;
