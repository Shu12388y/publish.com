import {Subscribers} from "@publish.com/database/db";

export type UpsertSubscriber = {
  email: string;
  topics: string[];
  organizationId: string;
};

export class SubscriberRepository {
  async upsertMany(subscribers: UpsertSubscriber[]) {
    const results = [];
    for (const subscriber of subscribers) {
      const existing = await Subscribers.findOne({
        organizationId: subscriber.organizationId,
        email: subscriber.email,
      });
      const existingTopics = existing?.topicsubscriber
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean) ?? [];
      const topicsubscriber = [
        ...new Set([...existingTopics, ...subscriber.topics]),
      ].join(",");

      results.push(
        await Subscribers.findOneAndUpdate(
          {
            organizationId: subscriber.organizationId,
            email: subscriber.email,
          },
          {
            $set: {topicsubscriber, isActive: true},
            $setOnInsert: {
              email: subscriber.email,
              organizationId: subscriber.organizationId,
              isVerified: true,
            },
          },
          {upsert: true, new: true, runValidators: true},
        ),
      );
    }
    return results;
  }
}
