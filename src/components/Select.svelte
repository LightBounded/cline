<script lang="ts">
	export let label: string;
	export let name: string;
	export let error: string | string[] = null;
	export let isTouched: boolean = null;
</script>

<div class="form-control">
	<label for={name} class="label">
		<span class="label-text">{label}</span>
	</label>
	<select {name} id={name} class="select select-bordered">
		<slot />
	</select>
	{#if isTouched && error}
		<label for={name} class="label ">
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
