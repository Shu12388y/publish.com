import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/config/api";

export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
  organization: string;
  organizationID: string;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
};

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = SignInPayload & {
  fullname: string;
  organization: string;
};

type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  message: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  message: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (payload: SignInPayload) => apiRequest<AuthResponse>("signin", payload),
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload: SignUpPayload) => apiRequest<AuthResponse>("signup", payload),
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => apiRequest<{ user: AuthUser }>("session", undefined, "GET"),
);

export const signOut = createAsyncThunk("auth/signOut", async () =>
  apiRequest<{ message: string }>("signout", {}),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Sign in failed";
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Sign up failed";
      })
      .addCase(signOut.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.message = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Sign out failed";
      });
  },
});

export default authSlice.reducer;
