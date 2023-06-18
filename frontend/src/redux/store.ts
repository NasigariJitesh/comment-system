import { configureStore } from '@reduxjs/toolkit';
import { commentPositionReducer } from './reducer';
import { setup } from './connect';
import userSlice from './actions/user';
import commentsSlice from './actions/comments';

const userReducer = userSlice.reducer;
const commentsReducer = commentsSlice.reducer;

export const store = configureStore({
	reducer: {
		commentPosition: commentPositionReducer,
		user: userReducer,
		comments: commentsReducer,
	},
});

export type Store = typeof store;

setup(store, { padding: 10 });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
