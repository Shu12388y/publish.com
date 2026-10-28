import {Webhook} from "@publish.com/database/db";

export type CreateWebhook = {
  backendUrl: string;
  webhookSecret: string;
  organizationId: string;
};

export type UpdateWebhook = {
  backendUrl?: string;
  isWebEnable?: boolean;
};

export class WebhookRepository {
  create(input: CreateWebhook) {
    return Webhook.create(input);
  }

  findAllByOrganization(organizationId: string) {
    return Webhook.find({organizationId})
      .select("-webhookSecret")
      .sort({createdAt: -1});
  }

  findById(organizationId: string, webhookID: string) {
    return Webhook.findOne({organizationId, _id: webhookID}).select(
      "-webhookSecret",
    );
  }

  updateById(
    organizationId: string,
    webhookID: string,
    update: UpdateWebhook,
  ) {
    return Webhook.findOneAndUpdate(
      {organizationId, _id: webhookID},
      {$set: update},
      {new: true, runValidators: true},
    ).select("-webhookSecret");
  }

  deleteById(organizationId: string, webhookID: string) {
    return Webhook.findOneAndDelete({organizationId, _id: webhookID});
  }
}
