<script lang="ts">
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import Input from 'src/components/Input.svelte';
	import IsAdminCheckBox from 'src/components/IsAdminCheckBox.svelte';
	import Modal from 'src/components/Modal.svelte';
	import { users } from 'src/stores/User';
	import type { User } from 'src/types';
	import { bool, object, string, type InferType } from 'yup';

	const userSchema = object({
		firstName: string().required('First name is required'),
		lastName: string().required('Last name is required'),
		email: string().required('Email is required'),
		username: string()
			.required('Username is required')
			.test('Unique', 'This username is already taken', (username) => {
				const usernames = $users.map((user) => user.username);

				if (username === selectedUser.username) return true;

				return !usernames.includes(username);
			}),
		password: string().min(8, 'Password must be minimum of 8 characters'),
		isAdmin: bool()
	});

	let selectedUser: User = null;
	let isOpen = false;

	const addUser = async (values: User) => {
		const res = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		users.set([...$users, await res.json()]);
	};

	const deleteUser = async (id: string) => {
		users.set($users.filter((user) => user._id !== id));
		await fetch(`/api/users/${id}`, {
			method: 'DELETE'
		});
	};

	const updateUser = async (id: string, values: User) => {
		users.set($users.map((doctor) => (doctor._id === id ? { id, ...values } : doctor)));
		await fetch(`/api/users/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(values)
		});
	};

	const selectUser = async (user: User) => {
		isOpen = true;
		setInitialValues((selectedUser = user));
	};

	const { form, errors, touched, setInitialValues } = createForm<InferType<typeof userSchema>>({
		onSubmit: async (values, { reset }) => {
			setInitialValues(null);
			if (selectedUser) {
				updateUser(selectedUser._id, values);
				return;
			}
			addUser(values);
			reset();
		},
		extend: validator({ schema: userSchema })
	});

	$: !isOpen && setInitialValues((selectedUser = null));
</script>

<div>
	<button class="btn my-2" on:click={() => (isOpen = true)}>Add User</button>
	{#if $users?.length}
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th />
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Username</th>
						<th>Password</th>
						<th>Is Admin</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $users as user, i}
						<tr>
							<td>{i}</td>
							<td>{user.firstName}</td>
							<td>{user.lastName}</td>
							<td>{user.email}</td>
							<td>{user.username}</td>
							<td>{user.password}</td>
							<td>{user.isAdmin ? 'Yes' : 'No'}</td>
							<td>
								{#if user._id}
									<button class="btn" on:click={() => deleteUser(user._id)}>Delete</button>
									<button class="btn" on:click={() => selectUser(user)}>Edit</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div>There are no users to display</div>
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
				name="email"
				label="Email"
				isTouched={$touched.email}
				error={$errors.email}
				placeholder="Email"
			/>
			<Input
				name="username"
				label="Username"
				isTouched={$touched.username}
				error={$errors.username}
				placeholder="Username"
			/>
			<Input
				name="password"
				label="Password"
				isTouched={$touched.password}
				error={$errors.password}
				placeholder="Password"
			/>
			<IsAdminCheckBox />
			<div class="modal-action">
				<button class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-ghost" on:click={() => (isOpen = false)}>Close</button>
			</div>
		</form>
	</Modal>
</div>
