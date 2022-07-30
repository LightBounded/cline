import { model, models, Schema } from 'mongoose';
import type { Patient } from "src/types";

export const PatientSchema = new Schema<Patient>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	sex: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zip: { type: String, required: true },
	phone: { type: String, required: true, unique: true },
	birthday: { type: String, required: true }
});

export default models.Patient ?? model('Patient', PatientSchema);
