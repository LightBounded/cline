<script lang="ts">
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import Input from 'src/components/Input.svelte';
	import Modal from 'src/components/Modal.svelte';
	import Select from 'src/components/Select.svelte';
	import type { Appointment, Doctor, Patient } from 'src/types';
	import { onMount } from 'svelte';
	import type { InferType } from 'yup';
	import { object, string } from 'yup';

	const appointmentSchema = object({
		status: string().required('A status must be selected'),
		doctor: string().required('A doctor must be selected'),
		patient: string().required('A appointment must be selected'),
		date: string()
			.required('Date is required')
			.test('Unique', 'An appointment is already schedules on this date', (date) => {
				const appointmentDates = appointments.map((appointment) => appointment.date);
				return !appointmentDates.includes(date);
			})
	});

	let appointments: Appointment[] = [];
	let doctors: Doctor[] = [];
	let patients: Patient[] = [];
	const statuses = ['Open', 'Closed', 'Delayed', 'Missed', 'Canceled'];
	let selectedAppointment: Appointment = null;
	let isOpen = false;

	const { form, errors, touched, setInitialValues } = createForm<
		InferType<typeof appointmentSchema>
	>({
		onSubmit: async (values, { reset }) => {
			setInitialValues(null);
			if (selectedAppointment) {
				updateAppointment(selectedAppointment._id, values);
				return;
			}
			addAppointment(values);
			reset();
		},
		extend: validator({ schema: appointmentSchema })
	});

	$: !isOpen && setInitialValues((selectedAppointment = null));

	const addAppointment = async (values: Appointment) => {
		const res = await fetch('/api/appointments', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		appointments = [...appointments, await res.json()];
	};

	const deleteAppointment = async (id: string) => {
		appointments = appointments.filter((appointment) => appointment._id !== id);
		await fetch(`/api/appointments/${id}`, {
			method: 'DELETE'
		});
	};

	const updateAppointment = async (id: string, values: Appointment) => {
		appointments = appointments.map((appointment) =>
			appointment._id === id ? { id, ...values } : appointment
		);
		await fetch(`/api/appointments/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
	};

	const selectAppointment = async (appointment: Appointment) => {
		isOpen = true;
		setInitialValues((selectedAppointment = appointment));
	};

	onMount(async () => {
		appointments = await fetch('/api/appointments').then((res) => res.json());
		doctors = await fetch('/api/doctors').then((res) => res.json());
		patients = await fetch('/api/patients').then((res) => res.json());
	});
</script>

<div>
	<button class="btn my-2" on:click={() => (isOpen = true)}>Add Appointment</button>
	{#if appointments.length}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th />
						<th>Doctor</th>
						<th>Patient</th>
						<th>Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each appointments as appointment, i}
						<tr>
							<td>{i}</td>
							<td>{appointment.doctor}</td>
							<td>{appointment.patient}</td>
							<td>{appointment.date}</td>
							<td>{appointment.status}</td>
							<td>
								<button class="btn" on:click={() => deleteAppointment(appointment._id)}
									>Delete</button
								>
								<button class="btn" on:click={() => selectAppointment(appointment)}>Edit</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div>There are no appointments to display</div>
	{/if}
	<Modal {isOpen} on:close={() => (isOpen = false)}>
		<form use:form>
			<Select name="doctor" label="Doctor" isTouched={$touched.doctor} error={$errors.doctor}>
				<option value="">Select a doctor</option>
				{#each doctors as doctor}
					<option>{doctor.firstName} {doctor.lastName}</option>
				{/each}
			</Select>
			<Select name="patient" label="Patient" isTouched={$touched.patient} error={$errors.patient}>
				<option value="">Select a patient</option>
				{#each patients as patient}
					<option>{patient.firstName} {patient.lastName}</option>
				{/each}
			</Select>
			<Input
				name="date"
				label="Date"
				type="datetime-local"
				isTouched={$touched.date}
				error={$errors.date}
				placeholder="Date"
			/>
			<Select name="status" label="Status" isTouched={$touched.status} error={$errors.status}>
				<option value="">Select a status</option>
				{#each statuses as status}
					<option>{status}</option>
				{/each}
			</Select>
			<div class="modal-action">
				<button class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-ghost" on:click={() => (isOpen = false)}>Close</button>
			</div>
		</form>
	</Modal>
</div>
