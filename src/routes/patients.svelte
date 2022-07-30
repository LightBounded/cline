<script lang="ts">
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import Input from 'src/components/Input.svelte';
	import Modal from 'src/components/Modal.svelte';
	import SexRadioGroup from 'src/components/SexRadioGroup.svelte';
	import type { Patient } from 'src/types';
	import { onMount } from 'svelte';
	import type { InferType } from 'yup';
	import { object, string } from 'yup';

	const patientSchema = object({
		firstName: string().required('First name is required'),
		lastName: string().required('Last name is required'),
		sex: string().required('A sex must be selected'),
		address: string().required('Address is required'),
		city: string().required('City is required'),
		state: string().required('State is required'),
		zip: string().required('Zip code is required'),
		phone: string().required('Phone number is required'),
		birthday: string().required('Birthday is required')
	});

	let patients: Patient[] = [];
	let selectedPatient: Patient = null;
	let isOpen = false;

	const { form, errors, touched, setInitialValues } = createForm<InferType<typeof patientSchema>>({
		onSubmit: async (values, { reset }) => {
			setInitialValues(null);
			if (selectedPatient) {
				updatePatient(selectedPatient._id, values);
				return;
			}
			addPatient(values);
			reset();
		},
		extend: validator({ schema: patientSchema })
	});

	$: !isOpen && setInitialValues((selectedPatient = null));

	const addPatient = async (values: Patient) => {
		const res = await fetch('/api/patients', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		patients = [...patients, await res.json()];
	};

	const deletePatient = async (id: string) => {
		patients = patients.filter((patient) => patient._id !== id);
		await fetch(`/api/patients/${id}`, {
			method: 'DELETE'
		});
	};

	const updatePatient = async (id: string, values: Patient) => {
		patients = patients.map((patient) => (patient._id === id ? { id, ...values } : patient));
		await fetch(`/api/patients/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
	};

	const selectPatient = async (patient: Patient) => {
		isOpen = true;
		setInitialValues((selectedPatient = patient));
	};

	onMount(async () => {
		const res = await fetch('/api/patients');
		patients = await res.json();
	});
</script>

<div>
	<button class="btn my-2" on:click={() => (isOpen = true)}>Add Patient</button>
	{#if patients.length}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th />
						<th>First Name</th>
						<th>Last Name</th>
						<th>Sex</th>
						<th>Address</th>
						<th>City</th>
						<th>State</th>
						<th>Zip</th>
						<th>Phone Number</th>
						<th>Birthday</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each patients as patient, i}
						<tr>
							<td>{i}</td>
							<td>{patient.firstName}</td>
							<td>{patient.lastName}</td>
							<td>{patient.sex}</td>
							<td>{patient.address}</td>
							<td>{patient.city}</td>
							<td>{patient.state}</td>
							<td>{patient.zip}</td>
							<td>{patient.phone}</td>
							<td>{patient.birthday}</td>
							<td>
								<button class="btn" on:click={() => deletePatient(patient._id)}>Delete</button>
								<button class="btn" on:click={() => selectPatient(patient)}>Edit</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div>There are no patients to display</div>
	{/if}
	<Modal
		{isOpen}
		on:close={() => {
			isOpen = false;
			selectedPatient = null;
		}}
	>
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
				name="birthday"
				label="Birthday"
				isTouched={$touched.birthday}
				error={$errors.birthday}
				placeholder="Birthday"
				type="date"
			/>
			<SexRadioGroup />
			<Input
				name="address"
				label="Address"
				isTouched={$touched.address}
				error={$errors.address}
				placeholder="Address"
			/>
			<Input
				name="city"
				label="City"
				isTouched={$touched.city}
				error={$errors.city}
				placeholder="City"
			/>
			<Input
				name="state"
				label="State"
				isTouched={$touched.state}
				error={$errors.state}
				placeholder="State"
			/>
			<Input
				name="zip"
				label="Zip"
				isTouched={$touched.zip}
				error={$errors.zip}
				placeholder="Zip"
			/>

			<div class="modal-action">
				<button class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-ghost" on:click={() => (isOpen = false)}>Close</button>
			</div>
		</form>
	</Modal>
</div>
