import { Model, Schema, model } from 'mongoose';
import crypto from 'crypto';
import { v1 as uuidv1 } from 'uuid';

uuidv1();

interface IUser {
	firstName: string;
	lastName?: string;
	email: string;
	encryptedPassword?: string;
	salt?: string;
}

interface IUserMethods {
	authenticate(password: string): boolean;
	securePassword(password: string): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		firstName: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true,
		},
		lastName: {
			type: String,
			maxlength: 32,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},

		encryptedPassword: {
			type: String,
			required: true,
		},
		salt: String,
	},
	{ timestamps: true }
);

const password = userSchema.virtual('password');

password.set(function (password) {
	//@ts-ignore
	this._password = password;
	this.salt = uuidv1();
	this.encryptedPassword = this.securePassword(password);
});

password.get(function () {
	//@ts-ignore
	return this._password;
});

userSchema.method('authenticate', function (plainpassword) {
	return this.securePassword(plainpassword) === this.encryptedPassword;
});

userSchema.method('securePassword', function (plainpassword) {
	if (!plainpassword) return '';
	try {
		return crypto
			.createHmac('SHA256', this.salt)
			.update(plainpassword)
			.digest('hex');
	} catch (err) {
		return '';
	}
});

export default model('User', userSchema);
