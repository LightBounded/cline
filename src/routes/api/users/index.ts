import type { RequestHandler } from '@sveltejs/kit';
import { connect } from 'src/db/connect';
import User from 'src/models/user';

export const get: RequestHandler = async () => {
	try {
		await connect();
		return {
			body: await User.find()
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
			body: await User.create(await request.json())
		};
	} catch (error) {
		return {
			status: 400,
			body: error
		};
	}
};
