import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../services/auth";
import { LoginPayload, RegisterPayload, AuthUser, ChangeUserEmail, ChangeUserPassword, ForgotPasswordPayload, ResetPasswordPayload } from "../../../types/store";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  loading: false,
  error: null,
};

/* ---------- THUNKS ---------- */

// User registration
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

// User login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return response; // expected: { user, token }
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// Optionally: refresh session / validate token
export const fetchUserThunk = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

// Optionally: refresh session / validate token
export const changeUserEmailThunk = createAsyncThunk(
  "auth/changeUserEmail",
  async (payload: ChangeUserEmail, { rejectWithValue }) => {
    try {
      const response = await authService.changeUserEmail(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

// Optionally: refresh session / validate token
export const changeUserPasswordThunk = createAsyncThunk(
  "auth/changeUserPassword",
  async (payload: ChangeUserPassword, { rejectWithValue }) => {
    try {
      const response = await authService.changeUserPassword(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

// Forgot password
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to send reset email");
    }
  }
);

// Reset password
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to reset password");
    }
  }
);

// ✅ Logout user (server + client)
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout(); // ✅ clears refresh cookie
  } catch (err) {
    console.error("Logout request failed:", err);
  }
});

/* ---------- SLICE ---------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // ✅ local cleanup only
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("access_token", action.payload);
      // localStorage.setItem("refresh_token", action.payload.refresh_token);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(loginThunk.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload.user;
      //   state.accessToken = action.payload.access_token;
      //   state.refreshToken = action.payload.refresh_token;
      //   localStorage.setItem("access_token", action.payload.access_token);
      //   localStorage.setItem("refresh_token", action.payload.refresh_token);
      //   localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ persist user
      // })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch current user
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })

      // Change user email
      .addCase(changeUserEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.email = action.payload.new_email;
          localStorage.setItem("email", JSON.stringify(action.payload.new_email));
        }
      })
      .addCase(changeUserEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change user password
      .addCase(changeUserPasswordThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeUserPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Logout (server + client)
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
