// src/features/posts/postsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postsService } from "../../../services/posts";
import { Post, GeneratePostPayload, SavePostPayload, DeleteSavedPostPayload } from "../../../types/store";

interface PostsState {
  loading: boolean;
  error: string | null;
  generatedPosts: Post[];
  savedPosts: Post[];
  imageLoading: boolean;
  imageError: string | null;
  generatedImageUrl: string | null;
  imageLoadingForPostIds: string[]; // now an array
}

const initialState: PostsState = {
  loading: false,
  error: null,
  generatedPosts: [],
  savedPosts: [],
  imageLoading: false,
  imageError: null,
  generatedImageUrl: null,
  imageLoadingForPostIds: [],
};

export const generatePostsThunk = createAsyncThunk(
  "posts/generate",
  async (payload: GeneratePostPayload, { rejectWithValue }) => {
    try {
      const response = await postsService.generatePosts(payload);
      return response.posts; // 👈 this extracts the array of posts
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to generate posts");
    }
  }
);

export const generateImageForPostThunk = createAsyncThunk(
  "posts/generateImage",
  async (payload: Post, { rejectWithValue }) => {
    try {
      const response = await postsService.generateImageForPost(payload);
      return { postId: payload.post_id, imageUrl: response.image_url };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch image for post");
    }
  }
)

export const savePostThunk = createAsyncThunk(
  "posts/savePost",
  async (payload: SavePostPayload, { rejectWithValue }) => {
    try {
      const response = await postsService.savePost(payload);
      return response.post; // return saved post from backend
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to save post");
    }
  }
);

export const deleteSavedPostThunk = createAsyncThunk(
  "posts/deleteSavedPost",
  async (payload: DeleteSavedPostPayload, { rejectWithValue }) => {
    try {
      await postsService.deleteSavedPost(payload);
      return payload.post_id; // ✅ explicitly return the ID
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete post");
    }
  }
);


export const fetchSavedPostsThunk = createAsyncThunk(
  "posts/fetchSaved",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsService.fetchSavedPosts();
      return response.posts;
    } catch (err: any) {
      return rejectWithValue(err.body ?? err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostImage: (state, action) => {
      const post = state.generatedPosts.find(p => p.post_id === action.payload);
      if (post) {
        post.image_url = "";
      }
    },
    clearPosts: (state) => {
      state.generatedPosts = [];
      state.error = null;
    },
    deletePost: (state, action) => {
      state.generatedPosts = state.generatedPosts.filter(p => p.post_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Post
      .addCase(savePostThunk.pending, (state) => {
        //state.loading = true;
        state.error = null;
      })
      .addCase(savePostThunk.fulfilled, (state, action) => {
        //state.loading = false;
        // Add saved post to list (if needed)
        //state.generatedPosts.push(action.payload);
      })
      .addCase(savePostThunk.rejected, (state, action) => {
        //state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Post
      .addCase(deleteSavedPostThunk.pending, (state) => {
        //state.loading = true;
        state.error = null;
      })
      .addCase(deleteSavedPostThunk.fulfilled, (state, action) => {

        state.savedPosts = state.savedPosts.filter(
          (post) => post.post_id !== String(action.payload)
        );
      })
      .addCase(deleteSavedPostThunk.rejected, (state, action) => {
        //state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generatePostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedPosts = action.payload;
      })
      .addCase(generatePostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateImageForPostThunk.pending, (state, action) => {
        state.imageLoading = true;
        state.imageError = null;
        state.generatedImageUrl = null;
        if (!state.imageLoadingForPostIds.includes(action.meta.arg.post_id)) {
          state.imageLoadingForPostIds.push(action.meta.arg.post_id);
        }
      })
      .addCase(generateImageForPostThunk.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.generatedImageUrl = action.payload.imageUrl;
        state.imageLoadingForPostIds = state.imageLoadingForPostIds.filter(id => id !== action.payload.postId);
        // Assign image to the correct post
        const post = state.generatedPosts.find(p => p.post_id === action.payload.postId);
        if (post) {
          post.image_url = action.payload.imageUrl;
        }
      })
      .addCase(generateImageForPostThunk.rejected, (state, action) => {
        state.imageLoading = false;
        state.imageError = action.payload as string;
        if (action.meta && action.meta.arg && action.meta.arg.post_id) {
          state.imageLoadingForPostIds = state.imageLoadingForPostIds.filter(id => id !== action.meta.arg.post_id);
        }
      })
      .addCase(fetchSavedPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPosts = action.payload;
      })
      .addCase(fetchSavedPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { clearPostImage, clearPosts, deletePost } = postsSlice.actions;

export default postsSlice.reducer;
