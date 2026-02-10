import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from './firebase';

const POSTS_COLLECTION = 'posts';

export const communityService = {
    /**
     * Fetch posts by country code
     */
    async getPostsByCountry(countryCode: string, limitCount: number = 20) {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 10000)
        );

        try {
            console.log(`[CommunityService] Fetching posts for: ${countryCode}`);

            // Start with a basic query to avoid indexing issues initially
            let q = query(
                collection(db, POSTS_COLLECTION),
                limit(limitCount)
            );

            // Re-enable orderBy after confirming basic connectivity works
            // or if indexes are already set up.
            if (countryCode === 'ALL') {
                q = query(
                    collection(db, POSTS_COLLECTION),
                    orderBy('createdAt', 'desc'),
                    limit(limitCount)
                );
            } else {
                q = query(
                    collection(db, POSTS_COLLECTION),
                    where('communityId', '==', countryCode),
                    orderBy('createdAt', 'desc'),
                    limit(limitCount)
                );
            }

            // Race the query against a timeout
            const querySnapshot = await Promise.race([
                getDocs(q),
                timeoutPromise
            ]) as any;

            const posts = querySnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(`[CommunityService] Success: Found ${posts.length} posts`);
            return posts;
        } catch (error: any) {
            console.error('[CommunityService] Error getting posts:', error);
            if (error.message === 'TIMEOUT') {
                console.warn('[CommunityService] Firestore request timed out. Check network or rules.');
            }
            // Return empty array instead of throwing to unblock UI
            return [];
        }
    },

    /**
     * Create a new post
     */
    async createPost(postData: {
        communityId: string;
        authorId: string;
        authorName: string;
        title: string;
        content: string;
        imageUri?: string;
    }) {
        try {
            let imageUrl = '';

            // Handle image upload if provided
            if (postData.imageUri) {
                imageUrl = await this.uploadImage(postData.imageUri);
            }

            // Race the creation against a timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 10000)
            );

            const docRef = await Promise.race([
                addDoc(collection(db, POSTS_COLLECTION), {
                    communityId: postData.communityId,
                    authorId: postData.authorId,
                    authorName: postData.authorName,
                    title: postData.title,
                    content: postData.content,
                    imageUrl,
                    likes: 0,
                    commentCount: 0,
                    createdAt: serverTimestamp(),
                }),
                timeoutPromise
            ]) as any;

            console.log('[CommunityService] Post created successfully:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('[CommunityService] Error creating post:', error);
            if (error.message === 'TIMEOUT') {
                throw new Error('Request timed out. Please check your network connection.');
            }
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check Firestore security rules.');
            }
            throw error;
        }
    },

    /**
     * Upload image to Firebase Storage
     */
    async uploadImage(uri: string) {
        try {
            const storage = getStorage();
            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = `community/${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 15000) // 15s timeout for images
            );

            // Race the upload against a timeout
            await Promise.race([
                uploadBytes(storageRef, blob),
                timeoutPromise
            ]);

            return await getDownloadURL(storageRef);
        } catch (error: any) {
            console.error('[CommunityService] Error uploading image:', error);
            if (error.message === 'TIMEOUT') {
                throw new Error('Image upload timed out. Please check your network.');
            }
            if (error.code === 'storage/unauthorized') {
                throw new Error('Permission denied. Please check Storage security rules.');
            }
            throw new Error('Failed to upload image.');
        }
    }
};
