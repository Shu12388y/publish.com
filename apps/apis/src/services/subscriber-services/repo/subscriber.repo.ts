import { Subscribers, Topic } from "@publish.com/database/db";

export type UpsertSubscriber = {
  email: string;
  topics: string[];
  organizationId: string;
};

export class SubscriberRepository {
  findAllByOrganization(organizationId: string) {
    return Subscribers.find({ organizationId })
      .populate("topicsubscriber", "topicName")
      .sort({ createdAt: -1 });
  }

  async upsertMany(subscribers: UpsertSubscriber[]) {
    const results = [];
    for (const subscriber of subscribers) {
      const topic = await Topic.findOne({
        organizationID: subscriber.organizationId,
        topicName: subscriber.topics[0],
      })
        .select({ _id: 1 })
        .lean();
      if (!topic) {
        throw new Error("One or more subscriber topics could not be resolved");
      }

      results.push(
        await Subscribers.findOneAndUpdate(
          {
            organizationId: subscriber.organizationId,
            email: subscriber.email,
          },
          {
            $set: { topicsubscriber: topic._id, isActive: true },
            $setOnInsert: {
              email: subscriber.email,
              organizationId: subscriber.organizationId,
              isVerified: true,
            },
          },
          { upsert: true, new: true, runValidators: true },
        ),
      );
    }
    return results;
  }
}
