import { Model, Schema, model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';

uuidv1();

interface IDocument {
	content: string;
	name: string;
	createdBy: Schema.Types.ObjectId;
	editorContent: string;
}

type DocumentModel = Model<IDocument, {}, {}>;

const documentSchema = new Schema<IDocument, DocumentModel, {}>(
	{
		content: {
			type: String,
			required: true,
		},
		name: String,
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		editorContent: String,
	},
	{ timestamps: true }
);

export default model('Document', documentSchema);
