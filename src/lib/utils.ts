import { writable } from "svelte/store";


export const canvasEl = writable()

export const capture = () => {
    const cav = document.querySelector('canvas');

    const img = cav!.toDataURL('image/jpeg')
    window.open()!.document.write('<img src="' + img + '" />')
};

export function removeGlbExtension(fileName: string): string {
    if (fileName.endsWith('.glb')) {
        return fileName.slice(0, -4);
    } else {
        return fileName;
    }
}


