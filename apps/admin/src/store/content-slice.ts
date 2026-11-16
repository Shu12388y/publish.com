import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ContentTemplate = {
  id: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  tone: "clear" | "warm" | "bold";
  audience: string;
};

type NewTemplate = Pick<ContentTemplate, "name" | "description" | "subject">;

type ContentState = {
  templates: ContentTemplate[];
  selectedTemplateId: string;
  status: "idle" | "saving" | "saved";
  lastSavedAt: string | null;
};

function templateFields(
  subject: string,
  body: string,
): Omit<ContentTemplate, "id" | "name" | "description"> {
  return {
    subject,
    preheader: "",
    body,
    ctaLabel: "",
    ctaUrl: "",
    tone: "clear",
    audience: "",
  };
}

const initialState: ContentState = {
  templates: [
    {
      id: "welcome",
      name: "Welcome note",
      description: "A warm first email for new readers.",
      ...templateFields(
        "Welcome to Publish.com",
        "Thanks for joining us. We will bring you useful stories, practical ideas, and updates worth opening.",
      ),
      preheader: "A better publishing rhythm starts here.",
      ctaLabel: "Explore Publish.com",
      ctaUrl: "https://publish.com",
      tone: "warm",
      audience: "New subscribers",
    },
    {
      id: "weekly-digest",
      name: "Weekly digest",
      description: "A clear editorial layout for recurring updates.",
      ...templateFields(
        "This week at Publish.com",
        "Here are the stories, ideas, and updates your audience should not miss this week.",
      ),
      preheader: "The short version of what matters this week.",
      ctaLabel: "Read the digest",
      ctaUrl: "",
      audience: "Existing readers",
    },
    {
      id: "announcement",
      name: "Announcement",
      description: "A focused format for product and audience news.",
      ...templateFields(
        "An update from Publish.com",
        "We have something new to share. Here is what is changing, why it matters, and what to do next.",
      ),
      preheader: "A clear update from the Publish.com team.",
      ctaLabel: "Learn more",
      ctaUrl: "",
      tone: "bold",
      audience: "Your community",
    },
  ],
  selectedTemplateId: "welcome",
  status: "idle",
  lastSavedAt: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    addTemplate(state, action: PayloadAction<NewTemplate>) {
      const baseId =
        action.payload.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") || "untitled";
      let id = baseId;
      let suffix = 2;
      while (state.templates.some((template) => template.id === id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }

      state.templates.push({
        id,
        name: action.payload.name.trim(),
        description:
          action.payload.description.trim() || "A custom email template.",
        ...templateFields(action.payload.subject.trim(), ""),
      });
      state.selectedTemplateId = id;
      state.status = "idle";
    },
    selectTemplate(state, action: PayloadAction<string>) {
      if (state.templates.some((template) => template.id === action.payload)) {
        state.selectedTemplateId = action.payload;
        state.status = "idle";
      }
    },
    generateTemplate(
      state,
      action: PayloadAction<{ id: string; prompt: string }>,
    ) {
      const template = state.templates.find(
        (item) => item.id === action.payload.id,
      );
      if (!template || !action.payload.prompt.trim()) return;

      const prompt = action.payload.prompt.trim();
      const lowerPrompt = prompt.toLowerCase();
      const isWelcome = lowerPrompt.includes("welcome");
      const isDigest =
        lowerPrompt.includes("newsletter") ||
        lowerPrompt.includes("digest") ||
        lowerPrompt.includes("weekly");
      const isLaunch =
        lowerPrompt.includes("launch") ||
        lowerPrompt.includes("announce") ||
        lowerPrompt.includes("new");
      const audienceMatch = prompt.match(/for ([^.!,]+)/i);
      const audience = audienceMatch?.[1]?.trim() || "your audience";

      template.subject = isWelcome
        ? "Welcome to Publish.com"
        : isDigest
          ? "This week at Publish.com"
          : isLaunch
            ? "Something new from Publish.com"
            : "An update from Publish.com";
      template.preheader = `A thoughtful update for ${audience}.`;
      template.audience = audience;
      template.tone = isLaunch ? "bold" : isWelcome ? "warm" : "clear";
      template.body = `Hi there,\n\n${prompt}\n\nWe put this together for ${audience}. Take a look and let us know what you think.\n\nBest,\nThe Publish.com team`;
      template.ctaLabel = isDigest ? "Read the latest" : "Learn more";
      template.ctaUrl = "";
      state.status = "idle";
    },
    updateTemplate(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<ContentTemplate, "id">>;
      }>,
    ) {
      const template = state.templates.find(
        (item) => item.id === action.payload.id,
      );
      if (!template) return;
      Object.assign(template, action.payload.changes);
      state.status = "idle";
    },
    saveTemplate(state) {
      state.status = "saved";
      state.lastSavedAt = new Date().toISOString();
    },
  },
});

export const {
  addTemplate,
  generateTemplate,
  saveTemplate,
  selectTemplate,
  updateTemplate,
} = contentSlice.actions;
export default contentSlice.reducer;
