import { Model, Schema, model } from 'mongoose';
import crypto from 'crypto';
import { v1 as uuidv1 } from 'uuid';

uuidv1();

interface IComment {
	id: string;
	content: string;
	commentedBy: Schema.Types.ObjectId;
	position: {
		pageX: number;
		pageY: number;
	};
	replies: Schema.Types.ObjectId[];
	document: Schema.Types.ObjectId;
}

type CommentModel = Model<IComment, {}, {}>;

const commentSchema = new Schema<IComment, CommentModel, {}>(
	{
		id: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		position: {
			pageX: Number,
			pageY: Number,
		},
		commentedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		document: { type: Schema.Types.ObjectId, ref: 'Document' },
		replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
	},
	{ timestamps: true }
);

export default model('Comment', commentSchema);
