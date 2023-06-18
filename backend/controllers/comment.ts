import { Request, Response } from 'express';
import Comment from '../models/comment';

export const createComment = (req: Request, res: Response) => {
	const comment = new Comment(req.body);
	comment
		.save()
		.then((comment) => {
			res.json(comment);
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				error: 'cannot create comment',
			});
		});
};

export const getCommentById = (req: Request, res: Response) => {
	Comment.findById(req.params.commentId)
		.populate({ path: 'commentedBy', select: 'firstName lastName' })
		.populate({ path: 'replies' })
		.exec()
		.then((comment) => {
			if (!comment) {
				return res.status(400).json({
					error: 'Comment not found',
				});
			}
			return res.json(comment);
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'Comment not found',
			});
		});
};

export const getCommentsByUser = (req: Request, res: Response) => {
	//@ts-ignore
	const user_id = req.auth._id;
	Comment.find({ commentedBy: user_id })
		.populate({ path: 'commentedBy', select: 'firstName lastName' })
		.populate({ path: 'replies' })
		.exec()
		.then((comment) => {
			if (!comment) {
				return res.status(400).json({
					error: 'Comments not found',
				});
			}
			return res.json(comment);
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'Comments not found',
			});
		});
};

export const getCommentsOfDocument = (req: Request, res: Response) => {
	console.log(req);
	//@ts-ignore
	const documentId = req.params.documentId;
	Comment.find({ document: documentId })
		.populate({ path: 'commentedBy', select: 'firstName lastName' })
		.populate({ path: 'replies' })
		.exec()
		.then((comment) => {
			if (!comment) {
				return res.status(400).json({
					error: 'Comments not found',
				});
			}
			return res.json(comment);
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'Comments not found',
			});
		});
};
