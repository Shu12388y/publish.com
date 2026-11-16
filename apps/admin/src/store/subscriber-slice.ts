import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/config/api";

export type Subscriber = {
  _id: string;
  email: string;
  topicsubscriber: {
    _id: string;
    topicName: string;
  };
  isActive: boolean;
  isVerified: boolean;
  organizationId: string;
};

type SubscriberState = {
  subscribers: Subscriber[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: SubscriberState = {
  subscribers: [],
  status: "idle",
  error: null,
};

export const fetchSubscribers = createAsyncThunk(
  "subscribers/fetchAll",
  async () =>
    apiRequest<{ subscribers: Subscriber[] }>("subscribers", undefined, "GET"),
);

export const createSubscriber = createAsyncThunk(
  "subscribers/create",
  async ({ email, topic }: { email: string; topic: string }) =>
    apiRequest<{ subscriber: Subscriber }>("subscribers", {
      email,
      topics: topic,
    }),
);

export const uploadSubscribers = createAsyncThunk(
  "subscribers/upload",
  async ({ file, topic }: { file: File; topic: string }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("topics", topic);
    return apiRequest<{ message: string; count: number }>(
      "subscribers/csv",
      formData,
    );
  },
);

const subscriberSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscribers = action.payload.subscribers;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load subscribers";
      })
      .addCase(createSubscriber.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSubscriber.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.subscribers.findIndex(
          (subscriber) => subscriber._id === action.payload.subscriber._id,
        );
        if (index === -1) {
          state.subscribers.unshift(action.payload.subscriber);
        } else {
          state.subscribers[index] = action.payload.subscriber;
        }
      })
      .addCase(createSubscriber.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not add subscriber";
      })
      .addCase(uploadSubscribers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadSubscribers.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(uploadSubscribers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not upload subscribers";
      });
  },
});

export default subscriberSlice.reducer;
