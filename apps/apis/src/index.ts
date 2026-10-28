import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { authRoute } from './services/auth-services/routes/auth.routes.js'
import { topicRoute } from './services/topics-services/routes/topic.routes.js'
import { subscriberRoute } from './services/subscriber-services/routes/subscriber.routes.js'
import { webhookRoute } from './services/webhook-services/routes/webhook.routes.js'

const app = new Hono()

app.route("/api/v1",authRoute);
app.route("/api/v1", topicRoute);
app.route("/api/v1", subscriberRoute);
app.route("/api/v1", webhookRoute);
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
