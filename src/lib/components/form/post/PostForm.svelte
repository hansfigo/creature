<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/shared/container.svelte';
	import {
		FileDropzone,
		getModalStore,
		Modal,
		ProgressRadial,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import App from './components/App.svelte';
	import { modelUpload } from '$lib/state';
	import { goto } from '$app/navigation';
	import { useFirebase } from '$lib/firebase';
	import { onMount } from 'svelte';
	import EditApp from './components/edit/EditApp.svelte';

	export let tags: {
		id: string;
		name: string | null;
	}[] = [];

	export let post: any | null = null;
	export let id: string | null = null;
	export let user: any = null;

	console.log(user, 'USER');

	let model: any = null;
	let title: string = '';
	let tag: string = '';
	let tagList: any = [];

	let description: string = '';

	let imageRef: HTMLImageElement;

	let base64: string;
	let image: any;

	let isLoading = false;

	let fileSize: any = null;

	const modalStore = getModalStore();

	const sizeLimitModal: ModalSettings = {
		type: 'confirm',
		title: 'File Size Limit',
		body: 'File size limit is 30MB, please upload a smaller file or upgrade your account',
		response: (r: boolean) => {
			if (r) {
				goto('/pricing');
			}
		}
	};

	const fileTypeModal: ModalSettings = {
		type: 'alert',
		title: 'File Type',
		body: 'Please upload .glb or .gltf file'
	};

	onMount(() => {
		if (!post) return;

		title = post.title;
		description = post.description;

		// create new array to store tag but change the key `name` to `tag`

		const parsedTags = post.tags.map((tag: any) => {
			return {
				id: tag.id,
				name: tag.tag
			};
		});
		tagList = parsedTags;
	});

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

		base64 = cav.toDataURL('img/png');

		setTimeout(() => {
			imageRef.src = base64;
		}, 400);

		const blob = base64ToBlob(base64, 'image/png');
		image = new File([blob], 'thumbnail.png', { type: 'image/png' });
	};

	function onChangeHandler(e: Event): void {
		const input = e.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			console.log(file.size, 'FILE TEXT');

			// validate file type, by checking file name extension
			if (!file.name.match(/\.(glb|gltf)$/)) {
				modalStore.trigger(fileTypeModal);
				return;
			}

			if (user.active_plan === 'basic') {
				if (file.size > 30000000) {
					modalStore.trigger(sizeLimitModal);
					return;
				}
			} else if (user.active_plan === 'standard') {
				if (file.size > 60000000) {
					modalStore.trigger(sizeLimitModal);
					return;
				}
			}

			model = file;
			fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

			modelUpload.set(file);
		}
	}

	const submit = async () => {
		isLoading = true;

		if (id) {
			const form = new FormData();

			if (title) {
				form.append('title', title);
			}

			if (description) {
				form.append('description', description);
			}

			if (tagList) {
				form.append('tags', JSON.stringify(tagList));
			}

			if (base64) {
				const thumbnailUrl = await useFirebase.uploadFile({
					file: image as File,
					path: '/users/posts/thumnails/'
				});

				form.append('thumbnail', thumbnailUrl);
			}

			try {
				const response = await fetch(`/api/post/${id}`, {
					method: 'PUT',
					body: form
				});

				if (response.status !== 200) {
					alert(
						'Error While Uploading Post, your model might be too big or server error, our team is working on it'
					);
					isLoading = false;
					return;
				}
				isLoading = false;
				goto(`/u/${post.user.username}/`);
			} catch (e) {
				alert(
					'Error While Uploading Post, your model might be too big or server error, our team is working on it'
				);
				isLoading = false;
				return;
			}
		} else {
			if (!model || !title || !base64) {
				alert('Please fill all fields');
				isLoading = false;
				return;
			}

			const fileUrl = await useFirebase.uploadFile({
				file: model as File,
				path: '/users/posts/models/'
			});

			const thumbnailUrl = await useFirebase.uploadFile({
				file: image as File,
				path: '/users/posts/thumnails/'
			});

			const form = new FormData();
			form.append('file', fileUrl);
			form.append('title', title);
			form.append('description', description);
			form.append('thumbnail', thumbnailUrl);
			form.append('tags', JSON.stringify(tagList));

			try {
				const response = await fetch('/api/post', {
					method: 'POST',
					body: form
				});

				if (response.status !== 200) {
					alert(
						'Error While Uploading Post, your model might be too big or server error, our team is working on it'
					);
					isLoading = false;
					return;
				}
				isLoading = false;
				goto('/');
			} catch (e) {
				alert(
					'Error While Uploading Post, your model might be too big or server error, our team is working on it'
				);
				isLoading = false;
			}

			isLoading = false;
		}
	};

	//list available tags for 3d post
	function pressed(ev: any) {
		if (ev.type !== 'blur' && ev.key !== ',' && ev.key !== 'Enter') return;

		tag = tag.replace(',', '');

		if (tag === '') return;

		tagList = [...tagList, tag];
		tag = '';
	}

	// remove tag by index
	function removeTag(index: number) {
		tagList = tagList.filter((_: any, i: number) => i !== index);
	}

	function selectTag(e: any) {
		const selectedTag = e.target.value;

		//check if already exist
		// if(tagList.includes(selectedTag)) return;

		const tag = tags.find((tag: any) => tag.id == selectedTag);

		tagList = [...tagList, tag];
	}
</script>

<Modal />
<Container>
	<p class="text-xl md:text-3xl font-bold mb-8">Create New 3D Post</p>
	{#if user}
		<div class="mb-4">
			<p class="mb-2">Plan :</p>
			<p class="chip variant-filled-secondary">{user.active_plan}</p>
		</div>
	{/if}
	<div class="flex flex-col md:flex-row w-full gap-8">
		<div class={`flex-1 ${post ? 'w-[20%]' : ''} `}>
			{#if model || post}
				<div>
					<div class="h-[28rem] rounded-3xl border-[1px] border-slate-800 mb-4">
						{#if id}
							<EditApp modelFile={post.modelPath} />
						{:else}
							<App />
						{/if}
					</div>
					<div class="flex gap-4">
						{#if !post}
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
						{/if}

						<button type="button" class="btn variant-outline-secondary" on:click={capture}
							>Create Thumbnail</button
						>
					</div>
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

			{#if fileSize}
				<p class="text-sm text-red-500">File size: {fileSize}</p>
			{/if}

			{#if base64}
				<label class="label text-2xl font-semibold mt-8 mb-3" for="thumnail">Thumbnail</label>
				<img bind:this={imageRef} id="img" src="/" class="border-[1px] border-slate-800" />
			{/if}
		</div>
		<div class="min-w-[30%]">
			<label class="label text-2xl font-semibold mt-4" for="title">Title</label>
			<br />
			<input class="input" type="text" name="title" bind:value={title} />
			<br />
			<label class="label text-2xl font-semibold mt-4" for="description">description</label>
			<br />
			<textarea class="textarea rounded-3xl" rows="6" bind:value={description} />
			<br />
			<label class="label">
				<label class="label mb-3 text-2xl font-semibold mt-4" for="description">Tags</label>
				<!-- <input
					class="input"
					type="text"
					name="tags"
					on:blur={pressed}
					on:keyup={pressed}
					bind:value={tag}
				/> -->
				<label class="label">
					<select on:change={selectTag} class="select">
						<option value="">--- Select Tags ---</option>
						{#each tags as tag}
							<option value={tag.id}>{tag.name}</option>
						{/each}
					</select>
				</label>
				<!-- TagList -->
				<div class="flex flex-wrap gap-1 pt-2">
					{#each tagList as tag, i}
						<div class="flex gap-2 items-center">
							<span class="bg-blue-primary text-white px-2 py-1 rounded-full"
								>{tag.name}
								<button on:click={() => removeTag(i)} class="px-2"> x </button>
							</span>
						</div>
					{/each}
				</div>
			</label>
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
