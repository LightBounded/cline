<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let isOpen;

	const dispatch = createEventDispatcher();

	const handleModalClick = (e: Event) => {
		const div = e.target as HTMLDivElement;
		div.classList.contains('modal') && dispatch('close');
	};
</script>

{#if isOpen}
	<div
		class="modal modal-open modal-bottom cursor-pointer sm:modal-middle"
		on:mousedown={handleModalClick}
	>
		<div class="modal-box cursor-auto">
			<slot />
		</div>
	</div>
{/if}
