// src/services/posts.ts
import { apiRequest } from "./apiClient";
import { Post, GeneratePostPayload, GeneratedPostsResponse, GeneratedImageResponse, SavePostPayload, DeleteSavedPostPayload } from "../types/store";

export const postsService = {
  generatePosts: (payload: GeneratePostPayload) =>
    apiRequest<GeneratedPostsResponse>("/shortform/ineedposts", {
      method: "POST",
      body: payload,
      skipAuth: true, // 👈 since it’s a public endpoint
    }),

  generateImageForPost: (payload: Post) =>
    apiRequest<GeneratedImageResponse>("/shortform/ineedimage", {
      method: "POST",
      body: payload,
      skipAuth: true, // 👈 since it’s a public endpoint
    }),

  // --- Auth-protected endpoints ---
  savePost: (payload: SavePostPayload) =>
    
    apiRequest<{ post: SavePostPayload }>("/shortform/savepost", {
      method: "POST",
      body: payload,
      // 👈 no skipAuth: token will be attached automatically by apiClient
    }),

  deleteSavedPost: (payload: DeleteSavedPostPayload) =>
    
    apiRequest<{ post: DeleteSavedPostPayload }>("/shortform/deletepost", {
      method: "DELETE",
      body: payload,
      // 👈 no skipAuth: token will be attached automatically by apiClient
    }),

  fetchSavedPosts: () =>
    apiRequest<{ posts: Post[] }>("/shortform/myposts", {
      method: "POST",
      // 👈 no skipAuth: requires valid JWT
    }),

  // fetchSavedPosts: () => apiRequest<Post[]>("/posts/saved"),
  // updateSavedPost: (id: string, changes: Partial<Post>) =>
  //   apiRequest<Post>(`/posts/${id}`, { method: "PATCH", body: changes }),
  // deleteSavedPost: (id: string) => apiRequest<void>(`/posts/${id}`, { method: "DELETE" }),
};
