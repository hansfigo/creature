import { writable } from 'svelte/store';

export const modelFile = writable<string>('girl_1.glb');

export const modelUpload = writable();

export const animationStore = writable<any[]>();

export const currentAnimationStore = writable<string>();

export const thumbnail = writable<string>();

export const isModelLoading = writable<boolean>(false);
