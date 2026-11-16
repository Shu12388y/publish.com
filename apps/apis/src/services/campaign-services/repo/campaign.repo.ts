import { Campaign } from "@publish.com/database/db";

export type CreateCampaign = {
  organizationId: string;
  topic?: string;
  subject: string;
  content: string;
  status?: string;
  isSchedule?: boolean;
  scheduleTime?: string;
  timezone?: string;
};

export type UpdateCampaign = Partial<Omit<CreateCampaign, "organizationId">>;

export class CampaignRepository {
  create(campaign: CreateCampaign) {
    return Campaign.create(campaign);
  }

  findAllByOrganization(organizationId: string) {
    return Campaign.find({ organizationId })
      .populate("topic", "topicName")
      .sort({ createdAt: -1 });
  }

  findById(organizationId: string, campaignID: string) {
    return Campaign.findOne({ organizationId, _id: campaignID }).populate(
      "topic",
      "topicName",
    );
  }

  updateById(
    organizationId: string,
    campaignID: string,
    update: UpdateCampaign,
  ) {
    return Campaign.findOneAndUpdate(
      { organizationId, _id: campaignID },
      { $set: update },
      { new: true, runValidators: true },
    ).populate("topic", "topicName");
  }

  deleteById(organizationId: string, campaignID: string) {
    return Campaign.findOneAndDelete({ organizationId, _id: campaignID });
  }
}
