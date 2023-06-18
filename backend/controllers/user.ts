import User from '../models/user';
import { body } from 'express-validator';
import { Request, Response } from 'express';

export const getUserById = (
	req: Request,
	res: Response,
	next: () => any,
	id: string
) => {
	User.findById(id)
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					error: 'USER not found',
				});
			}
			req.body.profile = user;
			next();
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'USER not found',
			});
		});
};

export const getUser = (req: Request, res: Response) => {
	//to hide update them as undefined:
	req.body.profile.salt = undefined;
	req.body.profile.encryptedPassword = undefined;
	return res.json(req.body.profile);
};

export const updateUser = (req: Request, res: Response) => {
	User.findByIdAndUpdate(
		{ _id: req.body.profile._id },
		{ $set: req.body },
		{ new: true, useFindandModify: false }
	)
		.then((user) => {
			if (!user)
				return res.status(400).json({
					error: 'Cannot Update the details',
				});
			else {
				user.salt = undefined;
				user.encryptedPassword = undefined;
				res.json(user);
			}
		})
		.catch((error) => {
			return res.status(400).json({
				error: 'You are not authorized to modify the details',
			});
		});
};

export const updateUserPassword = (req: Request, res: Response) => {
	User.findById(req.body.profile._id)
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					error: 'USER not found',
				});
			}
			const encryptedPassword = user.securePassword(req.body.newPassword);

			User.findByIdAndUpdate(
				{ _id: req.body.profile._id },
				{ $set: { encryptedPassword } },
				{ new: true, useFindandModify: false }
			)
				.then((user) => {
					if (!user)
						return res.status(400).json({
							error: 'Cannot Update the details',
						});
					else {
						user.salt = undefined;
						user.encryptedPassword = undefined;
						res.json(user);
					}
				})
				.catch((error) => {
					return res.status(400).json({
						error: 'You are not authorized to modify the details',
					});
				});
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'USER not found',
			});
		});
};
