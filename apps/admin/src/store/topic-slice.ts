import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/config/api";

export type Topic = {
  _id: string;
  topicName: string;
  status: string;
  organizationID: string;
  createdAt?: string;
};

type TopicState = {
  topics: Topic[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TopicState = {
  topics: [],
  status: "idle",
  error: null,
};

export const fetchTopics = createAsyncThunk("topics/fetchAll", async () =>
  apiRequest<{ topics: Topic[] }>("topics", undefined, "GET"),
);

export const createTopic = createAsyncThunk(
  "topics/create",
  async (payload: { topicName: string; status: string }) =>
    apiRequest<{ topic: Topic }>("topics", payload),
);

export const updateTopic = createAsyncThunk(
  "topics/update",
  async ({
    id,
    ...payload
  }: {
    id: string;
    topicName?: string;
    status?: string;
  }) => apiRequest<{ topic: Topic }>(`topics/${id}`, payload, "PATCH"),
);

export const deleteTopic = createAsyncThunk(
  "topics/delete",
  async (id: string) => {
    await apiRequest<{ message: string }>(`topics/${id}`, undefined, "DELETE");
    return id;
  },
);

const topicSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topics = action.payload.topics;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load topics";
      })
      .addCase(createTopic.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topics.unshift(action.payload.topic);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not create topic";
      })
      .addCase(updateTopic.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.topics.findIndex(
          (topic) => topic._id === action.payload.topic._id,
        );
        if (index !== -1) {
          state.topics[index] = action.payload.topic;
        }
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not update topic";
      })
      .addCase(deleteTopic.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topics = state.topics.filter(
          (topic) => topic._id !== action.payload,
        );
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not delete topic";
      });
  },
});

export default topicSlice.reducer;
