<script lang="ts">
	import { modelFile, modelUpload } from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { Group, type Object3DEventMap } from 'three';
	export const ref = new Group();

	let model: Group<Object3DEventMap>;
	let light: any;
	let camera: any;
	$: if (camera && model) {
		let boundingBox = new THREE.Box3().setFromObject(model);
		let height = boundingBox.getSize(new THREE.Vector3()).y;

		const roundedHeight = Number(height.toFixed(5));

		if (roundedHeight < 0.6) {
			console.log('Model Terlalu Kecil, Scaling ...');
			model.scale.set(10, 10, 10);
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

<T.AmbientLight args={[0xffffff, 1]} />

<T.PointLight bind:ref={light} args={[0xffffff, 1, 300]} position={[0, 1, 1]} />

{#if light}
	<T.PointLightHelper args={[light]} />
{/if}

<T.PerspectiveCamera bind:ref={camera} fov={40} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

{#if $modelUpload}
	{#await useGltf(URL.createObjectURL($modelUpload)) then gltf}
		<T bind:ref={model} is={gltf.scene} />
		<T.BoxHelper args={[model]} />
	{/await}
{/if}

<T.GridHelper args={[100]} />
