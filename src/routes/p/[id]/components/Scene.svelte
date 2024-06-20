<script lang="ts">
	import {
		animationStore,
		currentAnimationStore,
		isLightOn,
		isModelLoading,
	} from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf, useGltfAnimations } from '@threlte/extras';
	import { onDestroy } from 'svelte';
	import type { Group, Object3DEventMap } from 'three';
	import * as THREE from 'three';

	export let modelFile: string;

	const { actions, gltf } = useGltfAnimations();

	let model: Group<Object3DEventMap>;
	let camera: any;
	let bulbLightBack: any;
	let bulbLight: any;
	let scene: any;
	let light: any;

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

		// model.children.forEach((child) => {
		// 	if (child.type === 'Mesh') {
		// 		child.material.metalness = 0;
		// 	}
		// });

		if (scene) {
			scene.background = new THREE.Color().setHSL(0.6, 0, 1);
		}

		const fudgeFactor = 2;

		camera.position.copy(targetPosition);
		camera.position.z += distance * fudgeFactor;

		if (light) {
			light.position.copy(targetPosition);
			light.position.y += distance * 2;
		}

		if (bulbLight) {
			bulbLight.position.copy(targetPosition);
			bulbLight.position.z += distance * 4;
			// bulbLight.position.x += 10;

			bulbLight.intensity = 1.4;
		}

		if (bulbLightBack) {
			bulbLightBack.position.copy(targetPosition);
			bulbLightBack.position.z -= distance * 4;
			bulbLight.intensity = 1;
		}
	}

	isLightOn.subscribe((value) => {
		if (light) {
			light.intensity = value ? 1.4 : 0;
			bulbLight.intensity = value ? 1.4 : 0;
			bulbLightBack.intensity = value ? 1 : 0;
		}
	});
</script>



<T.HemisphereLight bind:ref={light} args={[0xffffff, 0xffffff, 1.4]} />
<T.DirectionalLight bind:ref={bulbLight} args={[0xffffff, 1, 10]} />
<T.DirectionalLight bind:ref={bulbLightBack} args={[0xffffff, 1, 10]} />
{#if light}
	<!-- <T.HemisphereLightHelper args={[light]} />
	<T.DirectionalLightHelper args={[bulbLight]} />
	<T.DirectionalLightHelper args={[bulbLightBack]} /> -->
{/if}

<T.PerspectiveCamera bind:ref={camera} fov={90} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

{#if $gltf}
	<T bind:ref={model} is={$gltf.scene} />
	<!-- <T.BoxHelper args={[model]} /> -->
	<!-- <T.GridHelper args={[100]} /> -->
{/if}


