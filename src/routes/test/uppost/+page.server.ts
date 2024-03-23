import { authFirebase } from '$lib/firebase';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface CreatePostInput {
    title: string;
    description: string;
    thumbnail: string;
    model: string;
    tags: string[];
    userId: string; // UID dari user yang membuat post
}

const createPost = async (input: CreatePostInput) => {
    try {
        const { title, description, thumbnail, model, tags, userId } = input;

        // Membuat post baru
        const newPost = await prisma.post.create({
            data: {
                title,
                description,
                thumbnail,
                model,
                userId, 
                tags: {
                    create: tags.map(tagName => ({
                        tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
                    })),
                },
            },
            include: { tags: true }, // Include tags in the response
        });

        console.log('New Post:', newPost);
        return newPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    } finally {
        await prisma.$disconnect(); // Tutup koneksi Prisma setelah selesai
    }
};


export const load = (async () => {

    console.log(authFirebase.currentUser);
    
    if (!authFirebase.currentUser) {
        console.log("Belum Login");
        
        throw redirect(302, '/signin')
    }

    console.log("Sudah Login dengan Nama : ", authFirebase.currentUser.displayName);
    

    const exampleTags = ['Anime', 'Girl'];
    const examplePostData: CreatePostInput = {
        userId : authFirebase.currentUser!.uid,
        title: 'Mahiro-Chan',
        description: 'Mahiro in class',
        thumbnail: 'sample_thumbnail.jpg',
        model: 'https://firebasestorage.googleapis.com/v0/b/d-web-39027.appspot.com/o/models%2Fmahiro.glb?alt=media&token=0df84e31-a466-41b0-a31d-ff99dfc99ad3',
        tags: exampleTags,
    };

    const examplePostData2: CreatePostInput = {
        userId : authFirebase.currentUser!.uid,
        title: 'Miyako',
        description: 'Miyako Model',
        thumbnail: 'sample_thumbnail.jpg',
        model: 'https://firebasestorage.googleapis.com/v0/b/d-web-39027.appspot.com/o/models%2Fblue_archive_-_miyako.glb?alt=media&token=70a3b938-8f3f-4d50-b755-d769a9ce0341',
        tags: exampleTags,
    };

    // await createPost(examplePostData);
    // await createPost(examplePostData2);

    return {};
}) satisfies PageServerLoad;