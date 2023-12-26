import { get, writable } from "svelte/store";
import { thumbnail } from "./state";

export const canvasEl = writable()

export const capture = () => {
    const cav = document.querySelector('canvas');

    const img = cav.toDataURL('image/jpeg')
    window.open().document.write('<img src="' + img + '" />')
};

export function removeGlbExtension(fileName: string): string {
    // Check if the file name ends with '.glb'
    if (fileName.endsWith('.glb')) {
        // Remove the last 4 characters (length of '.glb')
        return fileName.slice(0, -4);
    } else {
        // If the file name doesn't end with '.glb', return it unchanged
        return fileName;
    }
}