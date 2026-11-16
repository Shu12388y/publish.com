import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/config/api";

export type Domain = {
  _id: string;
  domain: string;
  status: string;
  isVerify: boolean;
  verificationToken?: string;
};

type DomainState = {
  domains: Domain[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: DomainState = {
  domains: [],
  status: "idle",
  error: null,
};

export const fetchDomains = createAsyncThunk("domains/fetchAll", async () =>
  apiRequest<{ domains: Domain[] }>("domains", undefined, "GET"),
);

export const createDomain = createAsyncThunk(
  "domains/create",
  async (domain: string) =>
    apiRequest<{ domain: Domain }>("domains", { domain }),
);

export const verifyDomain = createAsyncThunk(
  "domains/verify",
  async (id: string) => apiRequest<{ domain: Domain }>(`domains/${id}/verify`),
);

const domainSlice = createSlice({
  name: "domains",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.domains = action.payload.domains;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load domains";
      })
      .addCase(createDomain.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createDomain.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.domains.unshift(action.payload.domain);
      })
      .addCase(createDomain.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not add domain";
      })
      .addCase(verifyDomain.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyDomain.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.domains.findIndex(
          (domain) => domain._id === action.payload.domain._id,
        );
        if (index !== -1) {
          state.domains[index] = action.payload.domain;
        }
      })
      .addCase(verifyDomain.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not verify domain";
      });
  },
});

export default domainSlice.reducer;
