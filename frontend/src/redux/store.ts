import { configureStore } from '@reduxjs/toolkit';
import userSlice from './actions/user';
import commentsSlice from './actions/comments';
import docsSlice from './actions/docs';

const userReducer = userSlice.reducer;
const commentsReducer = commentsSlice.reducer;
const docsReducer = docsSlice.reducer;

export const store = configureStore({
	reducer: {
		user: userReducer,
		comments: commentsReducer,
		docs: docsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
