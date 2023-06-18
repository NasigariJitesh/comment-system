import { API } from './backend-connection';

interface SignUpData {
	firstName: string;
	lastName?: string;
	email: string;
	password: string;
}

interface SignInData {
	email: string;
	password: string;
}

interface SignInResponse {
	token: string;
	user: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
}

export const signUp = (user: SignUpData) => {
	return fetch(`${API}/signup`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};
export const signIn = (user: SignInData) => {
	console.log(user, API);
	return fetch(`${API}/signin`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...user }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const authenticate = (data: SignInResponse, next: () => any) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', JSON.stringify(data.token));
		localStorage.setItem('user', JSON.stringify(data.user));
		next();
	}
};
export const signOut = (next: () => any) => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('jwt');
		localStorage.removeItem('user');
		next();

		return fetch(`${API}/signout`, {
			method: 'GET',
		})
			.then((response) => console.log('signout success'))
			.catch((err) => console.log(err));
	}
};

export const isAuthenticated = () => {
	if (typeof window == 'undefined') {
		return false;
	}
	if (localStorage.getItem('jwt')) {
		return JSON.parse(localStorage.getItem('jwt') ?? '');
	} else {
		return false;
	}
};
