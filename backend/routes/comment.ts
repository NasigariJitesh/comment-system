import express from 'express';

import {
	createComment,
	getCommentById,
	getCommentsByUser,
	getCommentsOfDocument,
} from '../controllers/comment';
import { getUserById } from '../controllers/user';
import { isSignedIn, isAuthenticated } from '../controllers/auth';

const router = express.Router();

router.param('userId', getUserById);

router.get(
	'/comment/:commentId/:userId',
	isSignedIn,
	isAuthenticated,
	getCommentById
);
router.get(
	'/comment/all/:userId',
	isSignedIn,
	isAuthenticated,
	getCommentsByUser
);
router.get(
	'/comments/:documentId/:userId',
	isSignedIn,
	isAuthenticated,
	getCommentsOfDocument
);

// router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.post(
	'/comment/create/:userId',
	isSignedIn,
	isAuthenticated,
	createComment
);

export default router;
