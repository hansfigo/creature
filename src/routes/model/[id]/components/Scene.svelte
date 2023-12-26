<script lang="ts">
	import { storage } from '$lib/firebase';
	import { modelUpload } from '$lib/state';
	import { capture } from '$lib/utils';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf, useGltfAnimations } from '@threlte/extras';
	import { getDownloadURL, ref } from 'firebase/storage';
	import type { Group, Object3DEventMap } from 'three';
	import * as THREE from 'three';

	export let modelFile: string;

	console.log(modelFile);

	let model: Group<Object3DEventMap>;
	let camera: any;

	$: if (camera && model) {
		let boundingBox = new THREE.Box3().setFromObject(model);
		let height = boundingBox.getSize(new THREE.Vector3()).y;

		const roundedHeight = Number(height.toFixed(5));

		if (roundedHeight < 0.6) {
			console.log('Model Terlalu Kecil, Scaling ...');
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

	const { gltf } = useGltfAnimations();

	let modelGltf: Promise<any> | undefined = useGltf(modelFile);

	$: {
		console.log(modelFile);

		modelGltf = useGltf(modelFile);

		modelGltf
			?.then((e) => {
				gltf.set(e);

				console.log(e);
			})
			.catch((e) => {
				console.log(e.toString());
			});
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
