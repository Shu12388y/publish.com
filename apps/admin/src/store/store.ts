import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import topicReducer from "./topic-slice";
import subscriberReducer from "./subscriber-slice";
import domainReducer from "./domain-slice";
import campaignReducer from "./campaign-slice";
import contentReducer from "./content-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
    subscribers: subscriberReducer,
    domains: domainReducer,
    campaigns: campaignReducer,
    content: contentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
