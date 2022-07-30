import { model, models, Schema } from 'mongoose';

export const AppointmentSchema = new Schema({
	status: { type: String, required: true },
	doctor: { type: String, required: true },
	patient: { type: String, required: true },
	date: { type: String, required: true }
});


export default models.Appointment ?? model('Appointment', AppointmentSchema);
