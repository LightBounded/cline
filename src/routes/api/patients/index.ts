import type { RequestHandler } from '@sveltejs/kit';
import { connect } from 'src/db/connect';
import Patient from 'src/models/patient';

export const get: RequestHandler = async () => {
	try {
		await connect();
		return {
			body: await Patient.find()
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};

export const post: RequestHandler = async ({ request }) => {
	try {
		await connect();
		return {
			body: await Patient.create(await request.json())
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};
