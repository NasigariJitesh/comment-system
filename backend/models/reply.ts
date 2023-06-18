import { Model, Schema, model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';

uuidv1();

interface IReply {
	content: string;
	repliedBy: Schema.Types.ObjectId;
	comment: Schema.Types.ObjectId;
}

type ReplyModel = Model<IReply, {}, {}>;

const commentSchema = new Schema<IReply, ReplyModel, {}>(
	{
		content: {
			type: String,
			required: true,
		},
		repliedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
	},
	{ timestamps: true }
);

export default model('Reply', commentSchema);
