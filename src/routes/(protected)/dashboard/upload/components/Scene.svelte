<script lang="ts">
	import { isLightOn, modelUpload } from '$lib/state';
	import { T } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Group, type Object3DEventMap } from 'three';
	export const ref = new Group();

	let model: Group<Object3DEventMap>;
	let light: any;
	let camera: any;
	let scene: any;
	let bulbLight: any;
	let bulbMat: any;
	let bulbLightBack: any;
	let isMounted = false;


	$: {
		if (camera && model) {
			if (isMounted === false) {
				isMounted = true;
				const fudgeFactor = 2;
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

				model.children.forEach((child) => {
					if (child.type === 'Mesh') {
						child.material.metalness = 0;
					}
				});

				if (scene) {
					scene.background = new THREE.Color().setHSL(0.6, 0, 1);
				}

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

<!-- <T.Mesh>
		<T.BoxGeometry />
		<T.MeshBasicMaterial />
	</T.Mesh> -->

{#if light}
	<!-- <T.HemisphereLightHelper args={[light]} />
	<T.DirectionalLightHelper args={[bulbLight]} />
	<T.DirectionalLightHelper args={[bulbLightBack]} /> -->
{/if}

<T.PerspectiveCamera bind:ref={camera} fov={40} makeDefault>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

{#if $modelUpload}
	{#await useGltf(URL.createObjectURL($modelUpload)) then gltf}
		<T bind:ref={model} is={gltf.scene} />
		<!-- <T.BoxHelper args={[model]} /> -->
	{/await}
{/if}

<!-- <T.GridHelper args={[100]} /> -->
