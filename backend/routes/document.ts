import express from 'express';

import { getUserById } from '../controllers/user';
import { isSignedIn, isAuthenticated } from '../controllers/auth';
import {
	createDocument,
	getDocumentById,
	getDocumentsByUser,
	updateDocument,
} from '../controllers/document';

const router = express.Router();

router.param('userId', getUserById);

router.get(
	'/document/:documentId/:userId',
	isSignedIn,
	isAuthenticated,
	getDocumentById
);
router.get(
	'/documents/all/:userId',
	isSignedIn,
	isAuthenticated,
	getDocumentsByUser
);

router.put('/document/:userId', isSignedIn, isAuthenticated, updateDocument);

router.post(
	'/document/create/:userId',
	isSignedIn,
	isAuthenticated,
	createDocument
);

export default router;
