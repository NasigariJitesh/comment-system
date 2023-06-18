import { API } from './backend-connection';

interface UploadDocumentInput {
	createdBy: string;
	content: string;
	name: string;
}

interface UpdateDocumentInput {
	editorContent: string;
	content: string;
	documentId: string;
}

export const uploadDocument = (
	userId: string,
	token: string,
	document: UploadDocumentInput
) => {
	return fetch(`${API}/document/create/${userId}`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(document),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const fetchDocuments = (userId: string, token: string) => {
	return fetch(`${API}/documents/all/${userId}`, {
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

export const fetchDocumentByID = (
	userId: string,
	documentId: string,
	token: string
) => {
	return fetch(`${API}/document/${documentId}/${userId}`, {
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

export const updateDocument = (
	userId: string,
	token: string,
	document: UpdateDocumentInput
) => {
	return fetch(`${API}/document/${userId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(document),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};
