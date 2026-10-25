import { useState } from 'react'
import { MoreHorizontal, Plus, Search, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sidebar, SidebarLayout } from '@/components/ui/sidebar'

type Topic = {
  id: number
  name: string
  description: string
  posts: number
  status: 'Active' | 'Inactive'
}

const initialTopics: Topic[] = [
  { id: 1, name: 'Technology', description: 'Technology, software, and innovation', posts: 42, status: 'Active' },
  { id: 2, name: 'Business', description: 'Business insights and entrepreneurship', posts: 28, status: 'Active' },
  { id: 3, name: 'Design', description: 'Product, visual, and creative design', posts: 19, status: 'Active' },
  { id: 4, name: 'Culture', description: 'Ideas, people, and modern culture', posts: 16, status: 'Inactive' },
  { id: 5, name: 'Productivity', description: 'Tools and habits for doing your best work', posts: 12, status: 'Active' },
]

function Topics() {
  const [topics, setTopics] = useState(initialTopics)
  const [query, setQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTopic, setNewTopic] = useState({ name: '', description: '' })

  const filteredTopics = topics.filter((topic) =>
    `${topic.name} ${topic.description}`.toLowerCase().includes(query.toLowerCase()),
  )

  function toggleStatus(id: number) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id
          ? { ...topic, status: topic.status === 'Active' ? 'Inactive' : 'Active' }
          : topic,
      ),
    )
  }

  function addTopic() {
    const name = newTopic.name.trim()
    const description = newTopic.description.trim()

    if (!name) return

    setTopics((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        description: description || 'No description added',
        posts: 0,
        status: 'Active',
      },
    ])
    setNewTopic({ name: '', description: '' })
    setIsAddOpen(false)
  }

  return (
    <SidebarLayout>
      <Sidebar activeItem="Topics" />
      <main className="min-w-0 flex-1 md:h-svh md:overflow-y-auto">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Content organization</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Topics</h1>
              <p className="mt-1 text-muted-foreground">
                Organize your content and control which topics are available.
              </p>
            </div>
            <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
              <PopoverTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  Add topic
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <div className="space-y-1.5">
                  <h2 className="font-semibold">Add a new topic</h2>
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
                      onChange={(event) => setNewTopic({ ...newTopic, name: event.target.value })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') addTopic()
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-description">Description</Label>
                    <Input
                      id="topic-description"
                      placeholder="What is this topic about?"
                      value={newTopic.description}
                      onChange={(event) => setNewTopic({ ...newTopic, description: event.target.value })}
                    />
                  </div>
                  <Button className="w-full" type="button" onClick={addTopic}>
                    Create topic
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </header>

          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">All topics</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {topics.length} topics · {topics.filter((topic) => topic.status === 'Active').length} active
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
                    <th className="pb-3 font-medium">Posts</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Visibility</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <Tags className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{topic.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{topic.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground">{topic.posts}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            topic.status === 'Active' ? 'text-emerald-600' : 'text-muted-foreground'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${topic.status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                          {topic.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border p-0.5 shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            topic.status === 'Active'
                              ? 'border-primary bg-primary'
                              : 'border-input bg-muted hover:bg-muted/80'
                          }`}
                          type="button"
                          role="switch"
                          aria-checked={topic.status === 'Active'}
                          aria-label={`Set ${topic.name} ${topic.status === 'Active' ? 'inactive' : 'active'}`}
                          onClick={() => toggleStatus(topic.id)}
                        >
                          <span
                            className={`pointer-events-none block size-5 rounded-full border border-black/10 bg-white shadow-md ring-1 ring-black/5 transition-transform ${
                              topic.status === 'Active' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <button className="rounded-md p-1.5 hover:bg-muted" type="button" aria-label={`More options for ${topic.name}`}>
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTopics.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No topics found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  )
}

export default Topics
