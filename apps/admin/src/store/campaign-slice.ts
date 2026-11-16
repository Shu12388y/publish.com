import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/config/api";

export type CampaignTopic = {
  _id: string;
  topicName: string;
};

export type Campaign = {
  _id: string;
  subject: string;
  content: string;
  status: string;
  topic?: CampaignTopic;
  isSchedule: boolean;
  scheduleTime?: string;
  timezone?: string;
  createdAt?: string;
};

export type CampaignInput = {
  topic?: string;
  subject: string;
  content: string;
  status?: string;
  isSchedule?: boolean;
  scheduleTime?: string;
  timezone?: string;
};

type CampaignState = {
  campaigns: Campaign[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: CampaignState = {
  campaigns: [],
  status: "idle",
  error: null,
};

export const fetchCampaigns = createAsyncThunk("campaigns/fetchAll", async () =>
  apiRequest<{ campaigns: Campaign[] }>("campaigns", undefined, "GET"),
);

export const fetchCampaign = createAsyncThunk(
  "campaigns/fetchOne",
  async (id: string) =>
    apiRequest<{ campaign: Campaign }>(`campaigns/${id}`, undefined, "GET"),
);

export const createCampaign = createAsyncThunk(
  "campaigns/create",
  async (payload: CampaignInput) =>
    apiRequest<{ campaign: Campaign }>("campaigns", payload),
);

export const updateCampaign = createAsyncThunk(
  "campaigns/update",
  async ({ id, ...payload }: { id: string } & Partial<CampaignInput>) =>
    apiRequest<{ campaign: Campaign }>(`campaigns/${id}`, payload, "PATCH"),
);

export const deleteCampaign = createAsyncThunk(
  "campaigns/delete",
  async (id: string) => {
    await apiRequest<{ message: string }>(
      `campaigns/${id}`,
      undefined,
      "DELETE",
    );
    return id;
  },
);

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.campaigns = action.payload.campaigns;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load campaigns";
      })
      .addCase(fetchCampaign.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.campaigns.findIndex(
          (campaign) => campaign._id === action.payload.campaign._id,
        );
        if (index === -1) {
          state.campaigns.push(action.payload.campaign);
        } else {
          state.campaigns[index] = action.payload.campaign;
        }
      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load campaign";
      })
      .addCase(createCampaign.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.campaigns.unshift(action.payload.campaign);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not create campaign";
      })
      .addCase(updateCampaign.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.campaigns.findIndex(
          (campaign) => campaign._id === action.payload.campaign._id,
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload.campaign;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not update campaign";
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.campaigns = state.campaigns.filter(
          (campaign) => campaign._id !== action.payload,
        );
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not delete campaign";
      });
  },
});

export default campaignSlice.reducer;
