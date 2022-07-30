export interface Patient {
	_id?: string;
	firstName: string;
	lastName: string;
	sex: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	phone: string;
	birthday: string;
}

export interface Doctor {
	_id?: string;
	firstName: string;
	lastName: string;
	phone: string;
	specialization: string;
}

export interface Appointment {
	_id?: string;
	status: string;
	doctor: string;
	patient: string;
	date: string;
}

export interface User {
	_id?: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	isAdmin: boolean;
}
