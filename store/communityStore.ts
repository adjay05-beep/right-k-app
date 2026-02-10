import { create } from 'zustand';

export interface Post {
    id: string;
    communityId: string;
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: any; // Firebase Timestamp
    likes: number;
    commentCount: number;
}

export interface CommunityState {
    posts: Post[];
    selectedCountry: string; // e.g. 'PH', 'VN', 'KH', 'ALL'
    isLoading: boolean;
    error: string | null;

    setPosts: (posts: Post[]) => void;
    setSelectedCountry: (country: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addPost: (post: Post) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
    posts: [],
    selectedCountry: 'ALL',
    isLoading: false,
    error: null,

    setPosts: (posts) => set({ posts, isLoading: false }),
    setSelectedCountry: (selectedCountry) => set({ selectedCountry, posts: [] }), // Reset posts when country changes
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
