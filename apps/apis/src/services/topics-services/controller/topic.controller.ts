import type {Context} from "hono";
import type {TopicRepository} from "../repo/topic.repo.js";
import {TopicRepository as DefaultTopicRepository} from "../repo/topic.repo.js";
import {
  parseTopicInput,
  parseTopicUpdate,
  isValidTopicID,
} from "../helper/topic.helper.js";

export class TopicController {
  constructor(private readonly repository: TopicRepository) {}

  create = async (c: Context) => {
    const body: unknown = await c.req.json().catch(() => null);
    const input = parseTopicInput(body);
    if (!input) {
      return c.json({message: "topicName is required and must be valid"}, 400);
    }

    const topic = await this.repository.create({
      ...input,
      organizationID: c.var.auth.organizationID,
    });
    return c.json({topic}, 201);
  };

  findAll = async (c: Context) => {
    const topics = await this.repository.findAllByOrganization(
      c.var.auth.organizationID,
    );
    return c.json({topics});
  };

  find = async (c: Context) => {
    const topicID = c.req.param("topicID");
    if (!topicID || !isValidTopicID(topicID)) {
      return c.json({message: "Invalid topic ID"}, 400);
    }

    const topic = await this.repository.findById(
      c.var.auth.organizationID,
      topicID,
    );
    return topic ? c.json({topic}) : c.json({message: "Topic not found"}, 404);
  };

  update = async (c: Context) => {
    const topicID = c.req.param("topicID");
    if (!topicID || !isValidTopicID(topicID)) {
      return c.json({message: "Invalid topic ID"}, 400);
    }

    const body: unknown = await c.req.json().catch(() => null);
    const update = parseTopicUpdate(body);
    if (!update) {
      return c.json({message: "At least one valid field is required"}, 400);
    }

    const topic = await this.repository.updateById(
      c.var.auth.organizationID,
      topicID,
      update,
    );
    return topic ? c.json({topic}) : c.json({message: "Topic not found"}, 404);
  };

  delete = async (c: Context) => {
    const topicID = c.req.param("topicID");
    if (!topicID || !isValidTopicID(topicID)) {
      return c.json({message: "Invalid topic ID"}, 400);
    }

    const topic = await this.repository.deleteById(
      c.var.auth.organizationID,
      topicID,
    );
    return topic
      ? c.json({message: "Topic deleted successfully"})
      : c.json({message: "Topic not found"}, 404);
  };
}

export const topicController = new TopicController(new DefaultTopicRepository());
