<script lang="ts">
	type AcceptedInputTypes = 'text' | 'date' | 'password' | 'datetime-local';

	export let label: string;
	export let name: string;
	export let error: string | string[] = null;
	export let isTouched: boolean = null;
	export let placeholder: string = null;
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{label}</span>
	</label>
	<input {placeholder} {name} class="input input-bordered" />
	{#if isTouched && error}
		<label for={name} class="label ">
			<span class="label-text">{error}</span>
		</label>
	{/if}
</div>
