import { API } from './backend-connection';

export interface CreateCommentInput {
	commentedBy: string;
	content: string;
	id: string;
	position: {
		pageX: number;
		pageY: number;
	};
	document: string;
}

export const createComment = (
	userId: string,
	token: string,
	comment: CreateCommentInput
) => {
	return fetch(`${API}/comment/create/${userId}`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(comment),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getCommentByID = (
	userId: string,
	commentId: string,
	token: string
) => {
	return fetch(`${API}/comment/${commentId}/${userId}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getCommentsOfDoc = (
	userId: string,
	documentId: string,
	token: string
) => {
	return fetch(`${API}/comments/${documentId}/${userId}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};
