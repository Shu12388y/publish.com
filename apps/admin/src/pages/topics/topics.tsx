import { useEffect, useState } from "react";
import { MoreHorizontal, Plus, Search, Tags } from "lucide-react";
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
import {
  createTopic,
  deleteTopic,
  fetchTopics,
  updateTopic,
} from "@/store/topic-slice";

function isTopicActive(status: string) {
  return status.toLowerCase() === "active" || status === "1";
}

function Topics() {
  const dispatch = useAppDispatch();
  const { topics, status, error } = useAppSelector((state) => state.topics);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: "", status: "active" });

  useEffect(() => {
    void dispatch(fetchTopics());
  }, [dispatch]);

  const filteredTopics = topics.filter((topic) =>
    topic.topicName.toLowerCase().includes(query.toLowerCase()),
  );
  const activeTopicCount = topics.filter((topic) =>
    isTopicActive(topic.status),
  ).length;

  async function addTopic() {
    const name = newTopic.name.trim();
    if (!name) return;

    try {
      await dispatch(
        createTopic({ topicName: name, status: newTopic.status }),
      ).unwrap();
      setNewTopic({ name: "", status: "active" });
      setIsAddOpen(false);
    } catch (requestError) {
      console.error("Topic creation failed", requestError);
    }
  }

  async function toggleStatus(topic: (typeof topics)[number]) {
    try {
      await dispatch(
        updateTopic({
          id: topic._id,
          status: isTopicActive(topic.status) ? "inactive" : "active",
        }),
      ).unwrap();
    } catch (requestError) {
      console.error("Topic update failed", requestError);
    }
  }

  async function removeTopic(id: string) {
    if (!window.confirm("Delete this topic?")) return;

    try {
      await dispatch(deleteTopic(id)).unwrap();
    } catch (requestError) {
      console.error("Topic deletion failed", requestError);
    }
  }

  return (
    <SidebarLayout>
      <Sidebar activeItem="Topics" />
      <main className="min-w-0 flex-1 pt-16 md:h-svh md:overflow-y-auto md:pt-0">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">
                Content organization
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Topics
              </h1>
              <p className="mt-1 text-muted-foreground">
                Organize your content and control which topics are available.
              </p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  Add topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-1.5">
                  <DialogTitle className="font-semibold">
                    Add a new topic
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Create a topic to organize your published content.
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="topic-name">Name</Label>
                    <Input
                      id="topic-name"
                      placeholder="e.g. Technology"
                      value={newTopic.name}
                      onChange={(event) =>
                        setNewTopic({ ...newTopic, name: event.target.value })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void addTopic();
                      }}
                    />
                  </div>
                  <Button className="w-full" type="button" onClick={addTopic}>
                    Create topic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </header>

          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">All topics</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {topics.length} topics · {activeTopicCount} active
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search topics..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Topic</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Visibility</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTopics.map((topic) => {
                    const active = isTopicActive(topic.status);
                    return (
                      <tr key={topic._id}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                              <Tags className="size-4 text-muted-foreground" />
                            </div>
                            <p className="font-medium">{topic.topicName}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={
                              active
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border p-0.5 shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                              active
                                ? "border-primary bg-primary"
                                : "border-input bg-muted hover:bg-muted/80"
                            }`}
                            type="button"
                            role="switch"
                            aria-checked={active}
                            aria-label={`Set ${topic.topicName} ${active ? "inactive" : "active"}`}
                            disabled={status === "loading"}
                            onClick={() => void toggleStatus(topic)}
                          >
                            <span
                              className={`pointer-events-none block size-5 rounded-full border border-black/10 bg-white shadow-md ring-1 ring-black/5 transition-transform ${
                                active ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                            type="button"
                            aria-label={`Delete ${topic.topicName}`}
                            onClick={() => void removeTopic(topic._id)}
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {status === "loading" && topics.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading topics...
                </div>
              )}
              {status !== "loading" && filteredTopics.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No topics found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Topics;
