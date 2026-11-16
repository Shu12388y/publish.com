import { useEffect, useState, type FormEvent } from "react";
import { Mail, Plus, Tags, Upload, Users } from "lucide-react";
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
  createSubscriber,
  fetchSubscribers,
  uploadSubscribers,
} from "@/store/subscriber-slice";

function isActiveTopic(status: string) {
  return status.toLowerCase() === "active" || status === "1";
}

function Audience() {
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector((state) => state.topics);
  const {
    subscribers,
    status: subscriberStatus,
    error,
  } = useAppSelector((state) => state.subscribers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [email, setEmail] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const activeTopics = topics.filter((topic) => isActiveTopic(topic.status));

  useEffect(() => {
    void dispatch(fetchTopics());
    void dispatch(fetchSubscribers());
  }, [dispatch]);

  const topicName = selectedTopic || activeTopics[0]?.topicName || "";

  async function addSingleSubscriber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!topicName) return;

    try {
      await dispatch(createSubscriber({ email, topic: topicName })).unwrap();
      setEmail("");
      setSuccessMessage("Subscriber added successfully.");
      setIsAddOpen(false);
    } catch (requestError) {
      console.error("Subscriber creation failed", requestError);
      setSuccessMessage(null);
    }
  }

  async function uploadSubscriberFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !topicName) return;

    try {
      const result = await dispatch(
        uploadSubscribers({ file, topic: topicName }),
      ).unwrap();
      await dispatch(fetchSubscribers()).unwrap();
      setFile(null);
      setSuccessMessage(`${result.count} subscribers imported successfully.`);
      setIsAddOpen(false);
    } catch (requestError) {
      console.error("Subscriber upload failed", requestError);
      setSuccessMessage(null);
    }
  }

  return (
    <SidebarLayout>
      <Sidebar activeItem="Audience" />
      <main className="min-w-0 flex-1 pt-16 md:h-svh md:overflow-y-auto md:pt-0">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Audience</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Subscribers
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage the people subscribed to your topics.
              </p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  Add subscribers
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogTitle className="font-semibold">
                  Add subscribers
                </DialogTitle>
                <div className="flex border-b">
                  <button
                    className={`flex-1 border-b-2 pb-3 text-sm font-medium ${
                      activeTab === "single"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground"
                    }`}
                    type="button"
                    onClick={() => setActiveTab("single")}
                  >
                    Single email
                  </button>
                  <button
                    className={`flex-1 border-b-2 pb-3 text-sm font-medium ${
                      activeTab === "bulk"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground"
                    }`}
                    type="button"
                    onClick={() => setActiveTab("bulk")}
                  >
                    CSV upload
                  </button>
                </div>

                {activeTopics.length === 0 ? (
                  <p className="py-6 text-sm text-muted-foreground">
                    Create an active topic before adding subscribers.
                  </p>
                ) : activeTab === "single" ? (
                  <form
                    className="mt-4 space-y-4"
                    onSubmit={addSingleSubscriber}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="subscriber-email">Email</Label>
                      <Input
                        id="subscriber-email"
                        type="email"
                        placeholder="reader@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subscriber-topic">Topic</Label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        id="subscriber-topic"
                        value={topicName}
                        onChange={(event) =>
                          setSelectedTopic(event.target.value)
                        }
                      >
                        {activeTopics.map((topic) => (
                          <option key={topic._id} value={topic.topicName}>
                            {topic.topicName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={subscriberStatus === "loading"}
                    >
                      <Mail className="size-4" />
                      Add subscriber
                    </Button>
                  </form>
                ) : (
                  <form
                    className="mt-4 space-y-4"
                    onSubmit={uploadSubscriberFile}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="subscriber-file">CSV file</Label>
                      <Input
                        id="subscriber-file"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(event) =>
                          setFile(event.target.files?.[0] ?? null)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-topic">Topic</Label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        id="bulk-topic"
                        value={topicName}
                        onChange={(event) =>
                          setSelectedTopic(event.target.value)
                        }
                      >
                        {activeTopics.map((topic) => (
                          <option key={topic._id} value={topic.topicName}>
                            {topic.topicName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={subscriberStatus === "loading"}
                    >
                      <Upload className="size-4" />
                      Upload subscribers
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </header>

          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 text-sm text-emerald-600" role="status">
              {successMessage}
            </p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" />
                All subscribers
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {subscribers.length} subscribers
              </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Topic</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id}>
                      <td className="py-4 font-medium">{subscriber.email}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <Tags className="size-4" />
                          {subscriber.topicsubscriber.topicName}
                        </span>
                      </td>
                      <td className="py-4 text-emerald-600">
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {subscriber.isVerified ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscriberStatus === "loading" && subscribers.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading subscribers...
                </div>
              )}
              {subscriberStatus !== "loading" && subscribers.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No subscribers found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Audience;
