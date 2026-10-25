import { ArrowUpRight, Eye, FileText, MoreHorizontal, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarLayout } from '@/components/ui/sidebar'

const activity = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 47 },
  { day: 'Thu', value: 76 },
  { day: 'Fri', value: 65 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 72 },
]

const content = [
  { title: 'The future of independent publishing', status: 'Published', views: '12,847', date: 'Oct 24, 2026' },
  { title: 'How to build a loyal audience', status: 'Published', views: '8,421', date: 'Oct 21, 2026' },
  { title: 'Notes from our creator community', status: 'Draft', views: '—', date: 'Oct 19, 2026' },
  { title: 'Introducing the new Publish dashboard', status: 'Published', views: '6,209', date: 'Oct 15, 2026' },
]

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string
  value: string
  change: string
  icon: typeof Eye
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
          <ArrowUpRight className="size-3" />
          {change} <span className="text-muted-foreground">from last month</span>
        </p>
      </CardContent>
    </Card>
  )
}

function Analysis() {
  return (
    <SidebarLayout>
      <Sidebar />
      <main className="min-w-0 flex-1 md:h-svh md:overflow-y-auto">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Sunday, October 25, 2026</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analytics</h1>
              <p className="mt-1 text-muted-foreground">Track how your content is performing.</p>
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm" defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total views" value="48,295" change="+12.5%" icon={Eye} />
            <StatCard title="Unique visitors" value="18,642" change="+8.2%" icon={Users} />
            <StatCard title="Published posts" value="124" change="+4.6%" icon={FileText} />
            <StatCard title="Engagement rate" value="64.8%" change="+2.4%" icon={ArrowUpRight} />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Audience activity</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Views across the last 7 days</p>
                </div>
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <ArrowUpRight className="size-4" /> 12.5%
                </span>
              </CardHeader>
              <CardContent>
                <div className="flex h-56 items-end gap-3 pt-4 sm:gap-6">
                  {activity.map((item) => (
                    <div className="flex h-full flex-1 flex-col items-center justify-end gap-3" key={item.day}>
                      <div className="relative flex h-full w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                          style={{ height: `${item.value}%` }}
                          title={`${item.value}% activity`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top sources</CardTitle>
                <p className="text-sm text-muted-foreground">Where your audience comes from</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  ['Direct', '42%', 'bg-primary'],
                  ['Search', '31%', 'bg-primary/70'],
                  ['Social', '18%', 'bg-primary/50'],
                  ['Referral', '9%', 'bg-primary/30'],
                ].map(([source, percentage, color]) => (
                  <div key={source}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{source}</span>
                      <span className="text-muted-foreground">{percentage}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${color}`} style={{ width: percentage }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <Card className="mt-6">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Recent content</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Performance of your latest posts</p>
              </div>
              <a className="text-sm font-medium text-primary hover:underline" href="#content">
                View all
              </a>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Views</th>
                    <th className="pb-3 font-medium">Published</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {content.map((item) => (
                    <tr key={item.title}>
                      <td className="py-4 font-medium">{item.title}</td>
                      <td className="py-4">
                        <span className={item.status === 'Published' ? 'text-emerald-600' : 'text-muted-foreground'}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-muted-foreground">{item.views}</td>
                      <td className="py-4 text-muted-foreground">{item.date}</td>
                      <td className="py-4 text-right">
                        <button className="rounded-md p-1.5 hover:bg-muted" type="button" aria-label={`More options for ${item.title}`}>
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  )
}

export default Analysis
