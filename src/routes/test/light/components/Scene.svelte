<script lang="ts">
	import { modelFile, modelUpload } from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { Group, type Object3DEventMap } from 'three';
	export const ref = new Group();

	let model: any;
	let light: any;
	let camera: any;
	let scene: any;
	let bulbLight: any;
	let bulbMat: any;

	$: if (camera || model || light || bulbLight) {
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

		if (scene) {
			scene.background = new THREE.Color().setHSL(0.6, 0, 1);
		}

		if (light) {
			// light.groundColor.setHSL(0.095, 1, 0.75);
			// light.color.setHSL(0.6, 1, 0.6);
			// light.position.set(0, 10, 0);
			// light.intensity = 1000;
		}

		if (bulbLight) {
			bulbLight.intensity = 1000;
		}

		const fudgeFactor = 2;

		camera.position.copy(targetPosition);
		camera.position.z += distance * fudgeFactor;
	}
</script>

<T.HemisphereLight bind:ref={light} args={[0xffffff, 0xffffff, 1000]} />
<!-- <T.PointLight bind:ref={bulbLight} args={[0xffffff, 1, 100000]} position={[0, 4, 1]} /> -->

<T.Mesh bind:ref={model}>
	<T.BoxGeometry />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

{#if light}
	<T.HemisphereLightHelper args={[light]} />
{/if}

{#if bulbLight}
	<T.PointLightHelper args={[bulbLight]} />
{/if}

{#await useGltf(`/${$modelFile}`) then gltf}
	<T bind:ref={model} is={gltf.scene} />
	<T.BoxHelper args={[model]} />
{/await}

<T.PerspectiveCamera bind:ref={camera} fov={40} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.GridHelper args={[100]} />
