import type { RequestHandler } from '@sveltejs/kit';
import { connect } from 'src/db/connect';
import Patient from 'src/models/patient';

export const del: RequestHandler = async ({ params }) => {
	try {
		await connect();
		await Patient.deleteOne({ id: params.id });
		return {
			status: 200
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};

export const put: RequestHandler = async ({ params, request }) => {
	try {
		await connect();
		await Patient.updateOne({ id: params.id }, await request.json());
		return {
			status: 200
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};
