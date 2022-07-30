<script lang="ts">
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import Input from 'src/components/Input.svelte';
	import Modal from 'src/components/Modal.svelte';
	import type { Doctor } from 'src/types';
	import { onMount } from 'svelte';
	import type { InferType } from 'yup';
	import { object, string } from 'yup';

	const doctorSchema = object({
		firstName: string().required('First name is required'),
		lastName: string().required('Last name is required'),
		phone: string().required('Phone number is required'),
		specialization: string().required('Specialization is required')
	});

	let doctors: Doctor[] = [];
	let selectedDoctor: Doctor = null;
	let isOpen = false;

	const { form, errors, touched, setInitialValues } = createForm<InferType<typeof doctorSchema>>({
		onSubmit: async (values, { reset }) => {
			setInitialValues(null);
			if (selectedDoctor) {
				updatePatient(selectedDoctor._id, values);
				return;
			}
			addDoctor(values);
			reset();
		},
		extend: validator({ schema: doctorSchema })
	});

	$: !isOpen && setInitialValues((selectedDoctor = null));

	const addDoctor = async (values: Doctor) => {
		const res = await fetch('/api/doctors', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		doctors = [...doctors, await res.json()];
	};

	const deleteDoctor = async (id: string) => {
		doctors = doctors.filter((doctor) => doctor._id !== id);
		await fetch(`/api/doctors/${id}`, {
			method: 'DELETE'
		});
	};

	const updatePatient = async (id: string, values: Doctor) => {
		doctors = doctors.map((doctor) => (doctor._id === id ? { id, ...values } : doctor));
		await fetch(`/api/doctors/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
	};

	const selectDoctor = async (doctor: Doctor) => {
		isOpen = true;
		setInitialValues((selectedDoctor = doctor));
	};

	onMount(async () => {
		const res = await fetch('/api/doctors');
		doctors = await res.json();
	});
</script>

<div>
	<button class="btn my-2" on:click={() => (isOpen = true)}>Add Doctor</button>
	{#if doctors.length}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th />
						<th>First Name</th>
						<th>Last Name</th>
						<th>Phone Number</th>
						<th>Specialization</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each doctors as doctor, i}
						<tr>
							<td>{i}</td>
							<td>{doctor.firstName}</td>
							<td>{doctor.lastName}</td>
							<td>{doctor.phone}</td>
							<td>{doctor.specialization}</td>
							<td>
								<button class="btn" on:click={() => deleteDoctor(doctor._id)}>Delete</button>
								<button class="btn" on:click={() => selectDoctor(doctor)}>Edit</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div>There are no doctors to display</div>
	{/if}
	<Modal {isOpen} on:close={() => (isOpen = false)}>
		<form use:form>
			<Input
				name="firstName"
				label="First Name"
				isTouched={$touched.firstName}
				error={$errors.firstName}
				placeholder="First Name"
			/>
			<Input
				name="lastName"
				label="Last Name"
				isTouched={$touched.lastName}
				error={$errors.lastName}
				placeholder="Last Name"
			/>
			<Input
				name="phone"
				label="Phone Number"
				isTouched={$touched.phone}
				error={$errors.phone}
				placeholder="Phone Number"
			/>
			<Input
				name="specialization"
				label="Specialization"
				isTouched={$touched.specialization}
				error={$errors.specialization}
				placeholder="Specialization"
			/>

			<div class="modal-action">
				<button class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-ghost" on:click={() => (isOpen = false)}>Close</button>
			</div>
		</form>
	</Modal>
</div>
