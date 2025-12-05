import { apiRequest } from "./apiClient";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  AuthUser,
  ChangeUserEmail,
  ChangeUserPassword,
  ForgotPasswordPayload,
  ResetPasswordPayload
} from "../types/store";

export const authService = {
  // Register new user
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>("/shortform/signup", {
      method: "POST",
      body: payload,
      skipAuth: true, // no token required
    }),

  // Login existing user
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>("/shortform/signin", {
      method: "POST",
      body: payload,
      skipAuth: true, // no token required
    }),

  // Change user email
  changeUserEmail: (payload: ChangeUserEmail) =>
    apiRequest<{ new_email: string }>("/shortform/changeemail", {
      method: "POST",
      body: payload,
    }),

  // Change user password
  changeUserPassword: (payload: ChangeUserPassword) =>
    apiRequest<{ message: string }>("/shortform/changepassword", {
      method: "POST",
      body: payload,
    }),

  // Fetch current authenticated user
  getCurrentUser: () =>
    apiRequest<AuthUser>("/shortform/me", {
      method: "GET",
      skipAuth: false, // requires token
    }),

    // ✅ Logout user (clears cookie on backend) not using apiRequest because that attaches the access_token to it triggering a refresh
  logout: () =>
    fetch(`${process.env.REACT_APP_API_BASE_URL ?? "/api"}/shortform/logout`, {
      method: "POST",
      credentials: "include", // ✅ send cookie so backend can clear it
      headers: { "Content-Type": "application/json" },
    }),

  // Forgot password
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiRequest<{ message: string }>("/shortform/forgotpassword", {
      method: "POST",
      body: payload,
      skipAuth: true, // no token required
    }),

  // Reset password
  resetPassword: (payload: ResetPasswordPayload) =>
    apiRequest<{ message: string }>("/shortform/resetpassword", {
      method: "POST",
      body: payload,
      skipAuth: true, // no token required
    }),
};
