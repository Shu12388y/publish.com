import {Topic} from "@publish.com/database/db";

export type CreateTopic = {
  topicName: string;
  organizationID: string;
  status?: string;
};

export type UpdateTopic = {
  topicName?: string;
  status?: string;
};

export class TopicRepository {
  create(topic: CreateTopic) {
    return Topic.create(topic);
  }

  findAllByOrganization(organizationID: string) {
    return Topic.find({organizationID}).sort({createdAt: -1});
  }

  findById(organizationID: string, topicID: string) {
    return Topic.findOne({_id: topicID, organizationID});
  }

  updateById(
    organizationID: string,
    topicID: string,
    update: UpdateTopic,
  ) {
    return Topic.findOneAndUpdate(
      {_id: topicID, organizationID},
      {$set: update},
      {new: true, runValidators: true},
    );
  }

  deleteById(organizationID: string, topicID: string) {
    return Topic.findOneAndDelete({_id: topicID, organizationID});
  }
}
