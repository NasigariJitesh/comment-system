import { createSlice } from '@reduxjs/toolkit';

export const docsSlice = createSlice({
	name: 'docs',
	initialState: { value: [] },
	reducers: {
		updateDocs: (state, action) => {
			state.value = action.payload;
		},
	},
});

export default docsSlice;
