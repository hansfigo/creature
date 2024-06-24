// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	StorageError,
	uploadBytesResumable,
	type FirebaseStorage
} from 'firebase/storage';
import { generateIdFromEntropySize } from 'lucia';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDqoXd3qffrtNISBJlzjucmz4W1SWwAGc4',
	authDomain: 'd-web-39027.firebaseapp.com',
	projectId: 'd-web-39027',
	storageBucket: 'd-web-39027.appspot.com',
	messagingSenderId: '1032718342627',
	appId: '1:1032718342627:web:ed21bf70837f6eb338e8d6',
	measurementId: 'G-H1ZRV1B6FX'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authFirebase = getAuth(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);

const useFirebaseStorage = (storage: FirebaseStorage) => {
	const uploadFile = ({ file, path }: { file: File; path: string }): Promise<string> => {
		return new Promise(async (resolve, reject) => {
			
			const storageRef = ref(storage, `${path}${file.name}-${generateIdFromEntropySize(8)}`);

			// File does not exist, proceed with upload
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				(error) => {
					switch (error.code) {
						case 'storage/unauthorized':
							reject("User doesn't have permission to access the object");
							break;
						case 'storage/canceled':
							reject('User canceled the upload');
							break;
						case 'storage/unknown':
							reject('An unknown error occurred');
							break;
					}
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref)
						.then((downloadURL) => {
							console.log('File available at', downloadURL);
							resolve(downloadURL);
						})
						.catch(reject);
				}
			);
		});
	};

	const deleteFile = async (path: string) => {
		const storageRef = ref(storage, path);
		try {
			await deleteObject(storageRef);
			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	};

	return { uploadFile, deleteFile };
};

export const useFirebase = useFirebaseStorage(storage);
