import { useState, type FormEvent } from "react";
import { Bot, Plus, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar, SidebarLayout } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTemplate,
  generateTemplate,
  saveTemplate,
  selectTemplate,
} from "@/store/content-slice";

type ConversationMessage = {
  role: "assistant" | "user";
  content: string;
};

function Content() {
  const dispatch = useAppDispatch();
  const { templates, selectedTemplateId, status, lastSavedAt } = useAppSelector(
    (state) => state.content,
  );
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      role: "assistant",
      content:
        "Tell me what you want to send. Include the audience, purpose, tone, and call to action, and I will shape the full email.",
    },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    subject: "",
  });
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ??
    templates[0];

  function generateFromPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTemplate || !prompt.trim()) return;

    const request = prompt.trim();
    dispatch(generateTemplate({ id: selectedTemplate.id, prompt: request }));
    setConversation((messages) => [
      ...messages,
      { role: "user", content: request },
      {
        role: "assistant",
        content:
          "I shaped that brief into a complete email. Review the preview, then adjust any details before saving.",
      },
    ]);
    setPrompt("");
  }

  function handleCreateTemplate() {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim()) return;
    dispatch(addTemplate(newTemplate));
    setNewTemplate({ name: "", description: "", subject: "" });
    setIsCreateOpen(false);
  }

  if (!selectedTemplate) return null;

  return (
    <SidebarLayout>
      <Sidebar activeItem="Content" />
      <main className="min-w-0 flex-1 pt-16 md:h-svh md:overflow-y-auto md:pt-0">
        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Content studio</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Email agent
              </h1>
              <p className="mt-1 max-w-xl text-muted-foreground">
                Describe the email you need. The agent turns your brief into a
                complete draft you can review and save.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="h-10 min-w-56 rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
                value={selectedTemplateId}
                onChange={(event) =>
                  dispatch(selectTemplate(event.target.value))
                }
                aria-label="Choose an email template"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={() => dispatch(saveTemplate())}>
                <Save className="size-4" />
                Save draft
              </Button>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="size-4" />
                    New template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div>
                    <DialogTitle className="text-lg">
                      Start a new template
                    </DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Give the agent a blank workspace with a name.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template-name">Template name</Label>
                      <Input
                        id="template-name"
                        placeholder="e.g. Product launch"
                        value={newTemplate.name}
                        onChange={(event) =>
                          setNewTemplate({
                            ...newTemplate,
                            name: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template-description">Description</Label>
                      <Input
                        id="template-description"
                        placeholder="What is this template for?"
                        value={newTemplate.description}
                        onChange={(event) =>
                          setNewTemplate({
                            ...newTemplate,
                            description: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="template-subject">Email subject</Label>
                      <Input
                        id="template-subject"
                        placeholder="The subject used for this email"
                        value={newTemplate.subject}
                        onChange={(event) =>
                          setNewTemplate({
                            ...newTemplate,
                            subject: event.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      className="w-full"
                      type="button"
                      onClick={handleCreateTemplate}
                      disabled={
                        !newTemplate.name.trim() || !newTemplate.subject.trim()
                      }
                    >
                      Create workspace
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bot className="size-4" />
                  Tell the agent what to build
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Example: “Write a warm welcome email for new readers
                  explaining our weekly newsletter and inviting them to read the
                  first issue.”
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="flex max-h-56 flex-col gap-3 overflow-y-auto">
                  {conversation.map((message, index) => (
                    <div
                      className={cn(
                        "max-w-[90%] rounded-xl px-4 py-3 text-sm leading-6",
                        message.role === "assistant"
                          ? "bg-secondary text-secondary-foreground"
                          : "ml-auto bg-primary text-primary-foreground",
                      )}
                      key={`${message.role}-${index}`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={generateFromPrompt}
                >
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Describe the complete email you want to send..."
                    aria-label="Email requirements"
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!prompt.trim()}>
                      <Send className="size-4" />
                      Build email
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="h-fit overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Live preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review the reader&apos;s view.
                </p>
              </CardHeader>
              <CardContent className="bg-muted/20 p-5">
                <article className="overflow-hidden rounded-xl border bg-background shadow-sm">
                  <div className="border-b px-5 py-4">
                    <p className="text-xs text-muted-foreground">
                      {selectedTemplate.preheader || "Your preheader"}
                    </p>
                    <p className="mt-1 font-semibold">
                      {selectedTemplate.subject || "Your subject"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-5 px-5 py-7">
                    <p className="whitespace-pre-line text-sm leading-7">
                      {selectedTemplate.body ||
                        "Your generated message will appear here."}
                    </p>
                    {selectedTemplate.ctaLabel && (
                      <a
                        className="inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        href={selectedTemplate.ctaUrl || "#"}
                      >
                        {selectedTemplate.ctaLabel}
                      </a>
                    )}
                  </div>
                </article>
              </CardContent>
              <div className="border-t px-5 py-3 text-xs text-muted-foreground">
                {status === "saved" && lastSavedAt
                  ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
                  : "Unsaved changes"}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Content;
