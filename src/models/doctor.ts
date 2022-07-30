import { model, models, Schema } from 'mongoose';
import type { Doctor } from 'src/types';

export const DoctorSchema = new Schema<Doctor>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String, required: true, unique: true },
	specialization: { type: String, required: true, unique: true }
});

export default models.Doctor ?? model('Doctor', DoctorSchema);
