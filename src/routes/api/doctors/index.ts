import type { RequestHandler } from '@sveltejs/kit';
import { connect } from 'src/db/connect';
import Doctor from 'src/models/doctor';

export const get: RequestHandler = async () => {
	try {
		await connect();
		return {
			body: await Doctor.find()
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
			body: await Doctor.create(await request.json())
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};
