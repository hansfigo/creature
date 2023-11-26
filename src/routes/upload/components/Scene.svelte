<script lang="ts">
	import { modelFile, modelUpload } from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { Group, type Object3DEventMap } from 'three';
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
	<OrbitControls enableDamping  />
</T.PerspectiveCamera>

{#if $modelUpload}
	{#await useGltf(URL.createObjectURL($modelUpload)) then gltf}
		<T bind:ref={model} scale={0.2} is={gltf.scene} />
		<T.BoxHelper args={[model]} />
	{/await}
{/if}

<T.GridHelper args={[100]} />
