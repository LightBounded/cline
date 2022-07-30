import mongoose from 'mongoose';

export async function connect() {
	if (mongoose.connection.readyState >= 1) {
		return;
	}
	await mongoose.connect('mongodb://localhost:27017/clinic_system');
}
