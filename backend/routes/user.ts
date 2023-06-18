import express from 'express';

import {
	getUserById,
	getUser,
	updateUser,
	updateUserPassword,
} from '../controllers/user';
import { isSignedIn, isAuthenticated } from '../controllers/auth';

const router = express.Router();

router.param('userId', getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.put(
	'/user/changepassword/:userId',
	isSignedIn,
	isAuthenticated,
	updateUserPassword
);

export default router;
