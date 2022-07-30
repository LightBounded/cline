import type { RequestHandler } from '@sveltejs/kit';
import { connect } from 'src/db/connect';
import User from 'src/models/user';

export const del: RequestHandler = async ({ params }) => {
	try {
		await connect();
		await User.deleteOne({ id: params.id });
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
		await User.updateOne({ id: params.id }, await request.json());
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
