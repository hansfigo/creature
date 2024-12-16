<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { ICON } from '$lib/consants';
	import { writable } from 'svelte/store';
	import { is } from 'drizzle-orm';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageData;

	const { user, photoProfile } = data;

	const imageUrl = writable<string | null>(null);

	$: {
		if (photoProfile) {
			imageUrl.set(photoProfile);
		}
	}

	let isLoading = false;

	const formData = writable(data.form);

	const formSuperForm = superForm(data.form);

	let form = formSuperForm.form;

	$: {
		const formSuperForm = superForm(data.form);
		form = formSuperForm.form;
	}

	const handleImageSimple = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] as File;

		if (file) {
			imageUrl.set(URL.createObjectURL(file));
		}
	};
</script>

<section class="flex w-full justify-center">
	<div class="container">
		<form enctype="multipart/form-data" class="grid grid-cols-1 gap-4" use:enhance method="post">
			<div class="flex gap-4 items-center">
				<div class="w-28 h-28 bg-slate-700 rounded-full mb-4 relative">
					<img src={$imageUrl} alt="" class="h-full w-full rounded-full object-cover" />
					<label
						for="image"
						class="btn btn-icon btn-sm bg-white rounded-full absolute z-30 bottom-0 right-0"
					>
						<Icon icon="ic:baseline-edit" class="text-black text-sm" />
					</label>
					<input
						bind:value={$form.photoProfile}
						on:change={handleImageSimple}
						type="file"
						name="photoProfile"
						id="image"
						class="hidden"
					/>
				</div>
				<div>
					<label for="image" class="btn variant-filled-secondary btn-sm py-2 px-6">
						<span>Choose Image</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-8">
				<div>
					<label class="flex gap-1 items-center mb-3" for="last_name">
						<span>First Name</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.firstName} class="input" type="text" name="firstName" />
				</div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="last_name">
						<span>Last Name</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.lastName} class="input" type="text" name="lastName" />
				</div>
			</div>
			<div>
				<label class="flex gap-1 items-center mb-3" for="description">
					<span>Description</span>
					<Icon icon={ICON['ARROW-OUTWARD']} />
				</label>
				<textarea name="description" bind:value={$form.description} class="textarea" rows="4" id="description"></textarea>
			</div>
			<div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="company">
						<span>Company</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.company} class="input" type="text" name="company" />
				</div>
			</div>
			<div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="headline">
						<span>Headline</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.headline} class="input" type="text" name="headline" />
				</div>
			</div>
			<div class="grid grid-cols-2 gap-8">
				<div>
					<label class="flex gap-1 items-center mb-3" for="country">
						<span>Country</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label> <input bind:value={$form.country} class="input" type="text" name="country" />
				</div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="location">
						<span>Location</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.location} class="input" type="text" name="location" />
				</div>
			</div>
			<div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="linkedin">
						<span>Linkedin URL</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.linkedin} class="input" type="text" name="linkedin" />
				</div>
			</div>
			<div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="behance">
						<span>Behance URL</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.behance} class="input" type="text" name="behance" />
				</div>
			</div>
			<div>
				<div>
					<label class="flex gap-1 items-center mb-3" for="other">
						<span>Other URL</span>
						<Icon icon={ICON['ARROW-OUTWARD']} />
					</label>
					<input bind:value={$form.other} class="input" type="text" name="other" />
				</div>
			</div>
			<div class="flex w-full justify-end">
				<button type="submit" class="btn variant-filled-secondary">
					<span>Update</span>
					<Icon icon={ICON['ARROW-OUTWARD']} />
				</button>
			</div>
		</form>
	</div>
</section>
