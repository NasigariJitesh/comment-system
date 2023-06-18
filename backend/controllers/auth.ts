import User from '../models/user';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const expressJwt = require('express-jwt');

export const signUp = (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const user = new User(req.body);
	user
		.save()
		.then((user) => {
			res.json({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				id: user._id,
			});
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'email already in use',
			});
		});
};

export const signIn = (req: Request, res: Response) => {
	const { email, password } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	User.findOne({ email }).then((user) => {
		if (!user) {
			return res.status(400).json({
				error: "USER email doesn't exist",
			});
		}

		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "email and password doesn't match",
			});
		}

		//create token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET ?? '');
		//put token in cookie
		res.cookie('token', token, { expires: new Date(Date.now() + 3600000) });

		//send response to front end
		const { _id, firstName, email, lastName } = user;
		return res.json({ token, user: { _id, firstName, email, lastName } });
	});
};

export const signOut = (req: Request, res: Response) => {
	res.clearCookie('token');
	res.json({
		message: 'User sign out successfully',
	});
};

//protected routes
export const isSignedIn = expressJwt({
	secret: process.env.SECRET,
	algorithms: ['SHA256', 'RS256', 'sha1', 'HS256'],
	userProperty: 'auth',
});

//custom middleware
export const isAuthenticated = (
	req: Request,
	res: Response,
	next: () => any
) => {
	let checker =
		//@ts-expect-error Reason it does exits but type is not recognized
		req.body.profile && req.auth && req.body.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			error: 'Access Denied',
		});
	}
	next();
};
