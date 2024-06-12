import { writable } from 'svelte/store';

export const modelFile = writable<string>('p.glb');

export const modelUpload = writable();

export const animationStore = writable<any[]>();

export const currentAnimationStore = writable<string>();

export const thumbnail = writable<string>();

export const isModelLoading = writable<boolean>(false);

export const isLightOn = writable<boolean>(false);

