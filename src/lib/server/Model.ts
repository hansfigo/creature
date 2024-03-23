import { storage } from "$lib/firebase";
import { listAll, ref } from "firebase/storage";

function Model() {
    async function getModel() {
        try {
            const listRef = ref(storage, `/models`);
            const res = await listAll(listRef);
            const fileNames = res.items.map((itemRef) => itemRef.name);

            return fileNames;
        } catch (error) {
            console.error("Error fetching model list:", error);
            throw error;
        }
    }

    return {
        getModel
    }
}

export const model = Model()