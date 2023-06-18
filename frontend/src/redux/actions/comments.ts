import { createSlice } from '@reduxjs/toolkit';

export const commentsSlice = createSlice({
	name: 'comments',
	initialState: { value: [] },
	reducers: {
		updateComments: (state, action) => {
			state.value = action.payload;
		},
		clearComments: (state, action) => {
			state.value = [];
		},
	},
});

export default commentsSlice;
