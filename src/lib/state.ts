import { writable } from "svelte/store";

export const modelFile = writable<string>('girl_1.glb');

export const modelUpload = writable<any>()
