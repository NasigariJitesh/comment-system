import { Request, Response } from 'express';
import Document from '../models/document';

export const createDocument = (req: Request, res: Response) => {
	const document = new Document(req.body);
	document
		.save()
		.then((document) => {
			res.json(document);
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				error: 'cannot create document',
			});
		});
};

export const getDocumentsByUser = (req: Request, res: Response) => {
	console.log(req);

	//@ts-ignore
	const user_id = req.auth._id;
	Document.find({ createdBy: user_id })
		.populate({ path: 'createdBy', select: 'firstName lastName' })
		.select('-content -editorContent')
		.exec()
		.then((document) => {
			console.log(document);
			if (!document) {
				return res.status(400).json({
					error: 'Documents not found',
				});
			}

			return res.json(document);
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				error: 'Documents not found',
			});
		});
};

export const getDocumentById = (req: Request, res: Response) => {
	Document.findById(req.params.documentId)
		.populate({ path: 'createdBy', select: 'firstName lastName' })
		.exec()
		.then((document) => {
			if (!document) {
				return res.status(400).json({
					error: 'Document not found',
				});
			}
			return res.json(document);
		})
		.catch((err) => {
			return res.status(400).json({
				error: 'Document not found',
			});
		});
};

export const updateDocument = (req: Request, res: Response) => {
	Document.findByIdAndUpdate(
		{ _id: req.body.documentId },
		{
			$set: {
				content: req.body.content,
				editorContent: req.body.editorContent,
			},
		},
		{ new: true, useFindandModify: false }
	)
		.then((document) => {
			if (!document)
				return res.status(400).json({
					error: 'Cannot Update the documemt',
				});
			else {
				res.json(document);
			}
		})
		.catch((error) => {
			return res.status(400).json({
				error: 'You are not authorized to modify the details',
			});
		});
};
