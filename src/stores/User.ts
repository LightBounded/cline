import { browser } from '$app/env';
import type { User } from 'src/types';
import { writable } from 'svelte/store';

const user: User | null = browser ? JSON.parse(localStorage.getItem('currentUser')) : null;

export const currentUser = writable<User>(user);

export const users = writable<User[]>([
	{
		firstName: 'admin',
		lastName: 'admin',
		email: 'admin@domain.com',
		username: 'admin',
		password: 'admin',
		isAdmin: true
	}
]);
