import express from 'express';
import { check } from 'express-validator';

import { signOut, signUp, signIn } from '../controllers/auth';

const router = express.Router();

router.post(
	'/signup',
	[
		check('firstName', 'name should be at least 3 characters long').isLength({
			min: 3,
		}),
		check('email', 'enter a valid email').isEmail(),
		check('password', 'password must be at least 6 characters long').isLength({
			min: 6,
		}),
	],
	signUp
);

router.post(
	'/signin',
	[
		check('email', 'enter a valid email').isEmail(),
		check('password', 'password field is compulsory').isLength({ min: 1 }),
	],
	signIn
);

router.get('/signout', signOut);

export default router;
