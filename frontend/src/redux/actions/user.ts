import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		value:
			localStorage.getItem('user') !== null
				? JSON.parse(localStorage.getItem('user') ?? '')
				: undefined,
	},
	reducers: {
		updateUser: (state, action) => {
			state.value = action.payload;
		},
		signOut: (state, action) => {
			state.value = undefined;
		},
	},
});

export default userSlice;
