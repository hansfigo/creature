<script lang="ts">
	import { modelFile } from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { Group, type Object3DEventMap } from 'three';
	import Girl_4 from './girl_4.svelte';
	export const ref = new Group();

	let model: Group<Object3DEventMap>;
	let camera: any;


	$: if (camera && model) {
		const boundingBox = new THREE.Box3().setFromObject(model);
		const height = boundingBox.getSize(new THREE.Vector3()).y;
		const distance = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));

		console.log(height);

		const targetPosition = boundingBox.getCenter(new THREE.Vector3());

		// Center
		model.position.z = model.position.z - targetPosition.z;
		model.position.x = model.position.x - targetPosition.x;
		model.position.y = model.position.y - targetPosition.y;

		const fudgeFactor = 2;

		camera.position.copy(targetPosition);
		camera.position.z += distance * fudgeFactor;
	}
</script>

<T.PerspectiveCamera bind:ref={camera} fov={80} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 10]} />


<!-- <Girl_4/> -->

{#await useGltf($modelFile) then gltf}
	<T bind:ref={model} scale={0.2} is={gltf.scene} />
	<T.BoxHelper args={[model]} />
{/await}

<T.GridHelper args={[100]} />

