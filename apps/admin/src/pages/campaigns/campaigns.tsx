import { useEffect, useState, type FormEvent } from "react";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Sidebar, SidebarLayout } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTopics } from "@/store/topic-slice";
import {
  createCampaign,
  deleteCampaign,
  fetchCampaigns,
  updateCampaign,
  type Campaign,
} from "@/store/campaign-slice";

type CampaignForm = {
  subject: string;
  content: string;
  topic: string;
  status: string;
  isSchedule: boolean;
  scheduleTime: string;
  timezone: string;
};

const emptyForm: CampaignForm = {
  subject: "",
  content: "",
  topic: "",
  status: "DRAFT",
  isSchedule: false,
  scheduleTime: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

function Campaigns() {
  const dispatch = useAppDispatch();
  const { campaigns, status, error } = useAppSelector(
    (state) => state.campaigns,
  );
  const topics = useAppSelector((state) => state.topics.topics);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    void dispatch(fetchCampaigns());
    void dispatch(fetchTopics());
  }, [dispatch]);

  function openCreate() {
    setEditingCampaign(null);
    setForm(emptyForm);
    setIsEditorOpen(true);
  }

  function openEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setForm({
      subject: campaign.subject,
      content: campaign.content,
      topic: campaign.topic?._id ?? "",
      status: campaign.status,
      isSchedule: campaign.isSchedule,
      scheduleTime: campaign.scheduleTime ?? "",
      timezone:
        campaign.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setIsEditorOpen(true);
  }

  async function saveCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      subject: form.subject,
      content: form.content,
      status: form.status,
      isSchedule: form.isSchedule,
      ...(form.isSchedule
        ? { scheduleTime: form.scheduleTime, timezone: form.timezone }
        : {}),
      ...(form.topic ? { topic: form.topic } : {}),
    };

    try {
      if (editingCampaign) {
        await dispatch(
          updateCampaign({ id: editingCampaign._id, ...payload }),
        ).unwrap();
      } else {
        await dispatch(createCampaign(payload)).unwrap();
      }
      setIsEditorOpen(false);
    } catch (requestError) {
      console.error("Campaign save failed", requestError);
    }
  }

  async function removeCampaign(id: string) {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await dispatch(deleteCampaign(id)).unwrap();
    } catch (requestError) {
      console.error("Campaign deletion failed", requestError);
    }
  }

  return (
    <SidebarLayout>
      <Sidebar activeItem="Campaigns" />
      <main className="min-w-0 flex-1 pt-16 md:h-svh md:overflow-y-auto md:pt-0">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Email marketing</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Campaigns
              </h1>
              <p className="mt-1 text-muted-foreground">
                Create and manage campaigns for your audience.
              </p>
            </div>
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}>
                  <Plus className="size-4" />
                  New campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form className="space-y-4" onSubmit={saveCampaign}>
                  <div>
                    <DialogTitle className="font-semibold">
                      {editingCampaign ? "Edit campaign" : "New campaign"}
                    </DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Save a draft and refine it before sending.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-subject">Subject</Label>
                    <Input
                      id="campaign-subject"
                      value={form.subject}
                      onChange={(event) =>
                        setForm({ ...form, subject: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-topic">Topic</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      id="campaign-topic"
                      value={form.topic}
                      onChange={(event) =>
                        setForm({ ...form, topic: event.target.value })
                      }
                    >
                      <option value="">All topics</option>
                      {topics.map((topic) => (
                        <option key={topic._id} value={topic._id}>
                          {topic.topicName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-content">Content</Label>
                    <textarea
                      className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      id="campaign-content"
                      value={form.content}
                      onChange={(event) =>
                        setForm({ ...form, content: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-status">Status</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      id="campaign-status"
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value })
                      }
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="READY">Ready</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      className="size-4 rounded border-input accent-primary"
                      type="checkbox"
                      checked={form.isSchedule}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          isSchedule: event.target.checked,
                        })
                      }
                    />
                    Schedule this campaign
                  </label>
                  {form.isSchedule && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-schedule-time">
                          Schedule time
                        </Label>
                        <Input
                          id="campaign-schedule-time"
                          type="datetime-local"
                          value={form.scheduleTime}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              scheduleTime: event.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-timezone">Timezone</Label>
                        <Input
                          id="campaign-timezone"
                          value={form.timezone}
                          onChange={(event) =>
                            setForm({ ...form, timezone: event.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={status === "loading"}
                  >
                    {editingCampaign ? "Save changes" : "Create campaign"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </header>

          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="size-4" />
                All campaigns
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {campaigns.length} campaigns
              </p>
            </CardHeader>
            <CardContent>
              {status === "loading" && campaigns.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Loading campaigns...
                </p>
              ) : campaigns.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No campaigns yet. Create your first campaign.
                </div>
              ) : (
                <div className="divide-y">
                  {campaigns.map((campaign) => (
                    <div
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                      key={campaign._id}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {campaign.subject}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {campaign.content}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {campaign.topic?.topicName ?? "All topics"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {campaign.status}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${campaign.subject}`}
                          onClick={() => openEdit(campaign)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${campaign.subject}`}
                          onClick={() => void removeCampaign(campaign._id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Campaigns;
