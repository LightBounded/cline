import { model, models, Schema } from 'mongoose';
import type { User } from 'src/types';

export const UserSchema = new Schema<User>({
	firstName: { type: String },
	lastName: { type: String},
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true }
});

export default models.User ?? model('User', UserSchema);
