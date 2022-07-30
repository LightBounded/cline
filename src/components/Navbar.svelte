<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from 'src/stores/User';
	export let openLoginModal: () => void;
</script>

<div class="navbar mx-auto bg-base-100 lg:container">
	<div class="navbar-start">
		{#if $currentUser}
			<div class="dropdown">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/></svg
					>
				</label>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
				>
					<li>
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/patients">Patients</a>
					</li>
					<li>
						<a href="/doctors">Doctors</a>
					</li>
					<li>
						<a href="/appointments">Appointments</a>
					</li>

					{#if $currentUser?.isAdmin}
						<li>
							<a href="/users">Users</a>
						</li>
					{/if}
				</ul>
			</div>
		{/if}

		<a href="/" class="btn btn-ghost text-xl normal-case">Clinic System</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal p-0">
			{#if $currentUser}
				<li>
					<a href="/">Home</a>
				</li>
				<li>
					<a href="/patients">Patients</a>
				</li>
				<li>
					<a href="/doctors">Doctors</a>
				</li>
				<li>
					<a href="/appointments">Appointments</a>
				</li>
			{/if}

			{#if $currentUser?.isAdmin}
				<li>
					<a href="/users">Users</a>
				</li>
			{/if}
		</ul>
	</div>
	<div class="navbar-end">
		{#if $currentUser}
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn rounded-btn">Hello {$currentUser.firstName}</label>
				<ul tabindex="0" class="dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow">
					<li>
						<div
							on:click={() => {
								$currentUser = null;
								localStorage.removeItem('currentUser');
								goto('/');
							}}
						>
							Logout
						</div>
					</li>
				</ul>
			</div>
		{:else}
			<button class="btn" on:click={() => openLoginModal()}>Login</button>
		{/if}
	</div>
</div>
