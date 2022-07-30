<script lang="ts">
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import 'src/app.css';
	import Input from 'src/components/Input.svelte';
	import Modal from 'src/components/Modal.svelte';
	import Navbar from 'src/components/Navbar.svelte';
	import { currentUser, users } from 'src/stores/User';
	import { onMount } from 'svelte';
	import type { InferType } from 'yup';
	import { object, string } from 'yup';

	onMount(async () => {
		const res = await fetch('/api/users');
		users.set([...$users, ...(await res.json())]);
	});

	const loginSchema = object({
		username: string().required('Username is required'),
		password: string().required('Password is required')
	});

	let isInvalidCredentials = false;

	const { form, errors, touched, setErrors } = createForm<InferType<typeof loginSchema>>({
		onSubmit: async (values) => {
			const validLogins = $users.map(({ username, password }) => ({ username, password }));
			const isValidLogin = ({ username, password }) =>
				username === values.username && password === values.password;
			const user = $users.find(isValidLogin);

			if (validLogins.some(isValidLogin)) {
				currentUser.set(user);
				localStorage.setItem('currentUser', JSON.stringify(user));
				isOpen = false;
			}

			isInvalidCredentials = true;
		},
		extend: validator({ schema: loginSchema })
	});

	let isOpen = false;
</script>

<div class="flex min-h-screen flex-col ">
	<Navbar openLoginModal={() => (isOpen = true)} />
	<div class="mx-auto flex w-full flex-1 flex-col px-2 lg:container">
		<slot />
	</div>
	<Modal {isOpen} on:close={() => (isOpen = false)}>
		{#if isInvalidCredentials}
			<small class="text-error">Invalid user credentials</small>
		{/if}
		<form use:form>
			<Input
				name="username"
				label="Username"
				isTouched={$touched.username}
				error={$errors.username}
				placeholder="First Name"
			/>
			<Input
				name="password"
				label="Password"
				isTouched={$touched.password}
				error={$errors.password}
				placeholder="Password"
			/>
			<div class="modal-action">
				<button class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-ghost" on:click={() => (isOpen = false)}>Close</button>
			</div>
		</form>
	</Modal>
</div>
