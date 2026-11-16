import type { Context } from "hono";
import type { CampaignRepository } from "../repo/campaign.repo.js";
import { CampaignRepository as DefaultCampaignRepository } from "../repo/campaign.repo.js";
import {
  isValidCampaignID,
  parseCampaignInput,
  parseCampaignUpdate,
} from "../helper/campaign.helper.js";

export class CampaignController {
  constructor(private readonly repository: CampaignRepository) {}

  create = async (c: Context) => {
    const input = parseCampaignInput(await c.req.json().catch(() => null));
    if (!input) {
      return c.json(
        { message: "Subject and content are required for a campaign" },
        400,
      );
    }

    const campaign = await this.repository.create({
      ...input,
      organizationId: c.var.auth.organizationID,
    });
    return c.json({ campaign }, 201);
  };

  findAll = async (c: Context) => {
    const campaigns = await this.repository.findAllByOrganization(
      c.var.auth.organizationID,
    );
    return c.json({ campaigns });
  };

  find = async (c: Context) => {
    const campaignID = c.req.param("campaignID");
    if (!campaignID || !isValidCampaignID(campaignID)) {
      return c.json({ message: "Invalid campaign ID" }, 400);
    }

    const campaign = await this.repository.findById(
      c.var.auth.organizationID,
      campaignID,
    );
    return campaign
      ? c.json({ campaign })
      : c.json({ message: "Campaign not found" }, 404);
  };

  update = async (c: Context) => {
    const campaignID = c.req.param("campaignID");
    if (!campaignID || !isValidCampaignID(campaignID)) {
      return c.json({ message: "Invalid campaign ID" }, 400);
    }

    const update = parseCampaignUpdate(await c.req.json().catch(() => null));
    if (!update) {
      return c.json({ message: "At least one valid field is required" }, 400);
    }

    const campaign = await this.repository.updateById(
      c.var.auth.organizationID,
      campaignID,
      update,
    );
    return campaign
      ? c.json({ campaign })
      : c.json({ message: "Campaign not found" }, 404);
  };

  delete = async (c: Context) => {
    const campaignID = c.req.param("campaignID");
    if (!campaignID || !isValidCampaignID(campaignID)) {
      return c.json({ message: "Invalid campaign ID" }, 400);
    }

    const campaign = await this.repository.deleteById(
      c.var.auth.organizationID,
      campaignID,
    );
    return campaign
      ? c.json({ message: "Campaign deleted successfully" })
      : c.json({ message: "Campaign not found" }, 404);
  };
}

export const campaignController = new CampaignController(
  new DefaultCampaignRepository(),
);
