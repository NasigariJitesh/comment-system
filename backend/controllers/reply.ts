import { Request, Response } from 'express';
import Reply from '../models/reply';
import Comment from '../models/comment';

export const createReply = (req: Request, res: Response) => {
	const reply = new Reply(req.body);
	reply
		.save()
		.then((reply) => {
			Comment.findByIdAndUpdate(
				{ _id: reply.comment },
				{ $addToSet: { replies: reply._id } },
				{ new: true, useFindandModify: false }
			)
				.then((comment) => {
					if (!comment)
						return res.status(400).json({
							error: 'Cannot Update the comment',
						});
					else {
						res.json(comment);
					}
				})
				.catch((error) => {
					return res.status(400).json({
						error: 'You are not authorized to modify the details',
					});
				});
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				error: 'cannot create reply',
			});
		});
};

export const getRepliesByUser = (req: Request, res: Response) => {
	//@ts-ignore
	const user_id = req.auth._id;
	Reply.find({ repliedBy: user_id })
		.populate({ path: 'repliedBy', select: 'firstName lastName' })
		.populate({ path: 'comment' })
		.exec()
		.then((reply) => {
			if (!reply) {
				return res.status(400).json({
					error: 'Replies not found',
				});
			}
			return res.json(reply);
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'Replies not found',
			});
		});
};
