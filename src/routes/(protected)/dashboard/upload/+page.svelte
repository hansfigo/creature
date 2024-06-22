<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/shared/container.svelte';
	import { FileDropzone, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import Icon from '@iconify/svelte';
	import App from './components/App.svelte';
	import { modelUpload } from '$lib/state';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let model: any = null;
	let title: string = '';
	let description: string = '';

	let imageRef: HTMLImageElement;

	let base64: string;
	let image: any;

	let isLoading = false;

	function base64ToBlob(base64: string, contentType: string) {
		const byteCharacters = atob(base64.split(',')[1]);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		return new Blob([byteArray], { type: contentType });
	}

	const capture = () => {
		const cav = document.querySelector('canvas') as HTMLCanvasElement;

		if (!cav) {
			alert('Canvas not found');
			return;
		}

		console.log(cav, 'cav');
		base64 = cav.toDataURL('img/png');
		console.log(base64, 'base64');

		setTimeout(() => {
			imageRef.src = base64;
		}, 400);

		const blob = base64ToBlob(base64, 'image/png');
		image = new File([blob], 'thumbnail.png', { type: 'image/png' });
		console.log(image, 'file');
	};

	function onChangeHandler(e: Event): void {
		const input = e.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			model = file;

			modelUpload.set(file);
		}
	}

	const submit = async () => {
		isLoading = true;
		if (!model || !title || !base64) {
			alert('Please fill all fields');
			return;
		}

		const form = new FormData();
		form.append('file', model);
		form.append('title', title);
		form.append('description', description);
		form.append('thumbnail', image);

		console.log(form, 'form');

		try {
			const response = await fetch('/api/post', {
				method: 'POST',
				body: form
			});

			if (response.status !== 200) {
				alert('Error While Uploading Post, your model might be too big or server error, our team is working on it');
				isLoading = false;
				return;
			}
			isLoading = false;
			goto('/');
		} catch (e) {
			alert('Error While Uploading Post, your model might be too big or server error, our team is working on it');
			console.log(e);
			isLoading = false;
		}

		isLoading = false;
	};
</script>

<Container>
	<p class="text-3xl font-bold mb-8">Create New 3D Post</p>
	<div class="flex w-full gap-8">
		<div class="flex-1">
			{#if model}
				<div class="h-[28rem] w-full rounded-3xl border-[1px] border-slate-800 mb-4">
					<App />
				</div>
				<div class="flex gap-4">
					<div>
						<label class="label" for="">Reupload Model</label>
						<input
							class="input"
							on:change={onChangeHandler}
							type="file"
							name="model"
							accept=".glb"
						/>
					</div>

					<button type="button" class="btn variant-outline-secondary" on:click={capture}
						>Create Thumbnail</button
					>
				</div>
			{:else}
				<FileDropzone on:change={onChangeHandler} name="files" class="min-h-[30rem]">
					<svelte:fragment slot="lead">
						<div class="flex w-full h-full justify-center items-center">
							<img class="text-center w-44" src="/model-upload.svg" alt="" />
						</div>
					</svelte:fragment>
					<svelte:fragment slot="message">Upload your 3D Model or Drag and Drop</svelte:fragment>
					<svelte:fragment slot="meta">.glb and .gltf are allowed</svelte:fragment>
				</FileDropzone>
			{/if}

			{#if base64}
				<label class="label text-2xl font-semibold mt-8 mb-3" for="thumnail">Thumbnail</label>
				<img
					bind:this={imageRef}
					id="img"
					src="/"
					alt="Thumbnail Image"
					class="border-[1px] border-slate-800"
				/>
			{/if}
		</div>
		<div class="min-w-[30%]">
			<label class="label text-2xl font-semibold mt-4" for="title">Title</label>
			<br />
			<input class="input" type="text" name="title" bind:value={title} />
			<br />
			<br />

			<label class="label text-2xl font-semibold mt-4" for="description">description</label>
			<br />
			<textarea class="textarea rounded-3xl" rows="6" bind:value={description} />
			<br />
			<br />
			<div>
				<button disabled={isLoading} class="btn variant-outline-secondary" on:click={submit}>
					{#if isLoading}
						<ProgressRadial class="w-4" />
					{/if}
					<span>Submit</span>
				</button>
			</div>
		</div>
	</div>
</Container>
