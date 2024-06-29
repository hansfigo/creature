<script lang="ts">
	import { storage } from '$lib/firebase';
	import { animationStore, currentAnimationStore, isModelLoading, modelUpload } from '$lib/state';
	import { capture } from '$lib/utils';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf, useGltfAnimations } from '@threlte/extras';
	import { getDownloadURL, ref } from 'firebase/storage';
	import { onDestroy } from 'svelte';
	import type { Group, Object3DEventMap } from 'three';
	import * as THREE from 'three';

	export let modelFile: string;

	const { actions, gltf } = useGltfAnimations();

	let model: Group<Object3DEventMap>;
	let camera: any;

	let modelGltf: Promise<any> | undefined = useGltf(modelFile);

	$: {
		isModelLoading.set(true);

		modelGltf = useGltf(modelFile);

		modelGltf
			?.then((e) => {
				gltf.set(e);
				isModelLoading.set(false);
			})
			.catch((e) => {
				isModelLoading.set(false);
			});
	}

	$: {
		const animationArray = Object.entries($actions);

		animationStore.set(animationArray);

		if ($currentAnimationStore) {
			$actions[$currentAnimationStore]?.play();
		}
	}

	onDestroy(() => {
		currentAnimationStore.set('');
	});

	$: if (camera && model) {
		let boundingBox = new THREE.Box3().setFromObject(model);
		let height = boundingBox.getSize(new THREE.Vector3()).y;

		const roundedHeight = Number(height.toFixed(5));

		if (roundedHeight < 0.6) {
			model.scale.set(15, 15, 15);
		}

		// Set up boundingBox again after scaling
		boundingBox.setFromObject(model);
		height = boundingBox.getSize(new THREE.Vector3()).y;

		const distance = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
		const targetPosition = boundingBox.getCenter(new THREE.Vector3());

		// Center model
		model.position.sub(targetPosition);

		const fudgeFactor = 2;

		camera.position.copy(targetPosition);
		camera.position.z += distance * fudgeFactor;
	}
</script>

<T.PerspectiveCamera bind:ref={camera} fov={40} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 10]} />

{#if $gltf}
	<T bind:ref={model} scale={0.2} is={$gltf.scene} />
	<T.BoxHelper args={[model]} />
	<T.GridHelper args={[100]} />
{/if}

<!-- <Girl_4/> -->

<!-- {#await useGltf($modelFile) then gltf}
	<T bind:ref={model} scale={0.2} is={gltf.scene} />
	<T.BoxHelper args={[model]} />
		<T.GridHelper args={[100]} />
{/await} -->
