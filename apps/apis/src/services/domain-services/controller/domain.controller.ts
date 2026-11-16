import type { Context } from "hono";
import mongoose from "mongoose";
import { z } from "zod";
import {
  addDomain as addSesDomain,
  verifyDomain as verifySesDomain,
} from "../../../config/domain/aws.domain.js";
import type { DomainRepository } from "../repo/domain.repo.js";
import { DomainRepository as DefaultDomainRepository } from "../repo/domain.repo.js";

const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/);

function getVerificationStatus(
  result: Awaited<ReturnType<typeof verifySesDomain>>,
  domain: string,
) {
  return (
    result.VerificationAttributes?.[domain]?.VerificationStatus ?? "Pending"
  );
}

export class DomainController {
  constructor(private readonly repository: DomainRepository) {}

  findAll = async (c: Context) => {
    const domains = await this.repository.findAllByOrganization(
      c.var.auth.organizationID,
    );
    const result = await Promise.all(
      domains.map(async (domain) => {
        const verification = await verifySesDomain(domain.domain);
        const status = getVerificationStatus(verification, domain.domain);
        return { ...domain, status };
      }),
    );
    return c.json({ domains: result });
  };

  create = async (c: Context) => {
    const body = await c.req.json().catch(() => null);
    const parsed = z.object({ domain: domainSchema }).safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "A valid domain is required" }, 400);
    }
    const { domain } = parsed.data;

    if (await this.repository.findByDomain(c.var.auth.organizationID, domain)) {
      return c.json({ message: "Domain is already configured" }, 409);
    }

    const verification = await addSesDomain(domain);
    const saved = await this.repository.create({
      organizationId: c.var.auth.organizationID,
      domain,
      verificationToken: verification.VerificationToken,
    });
    return c.json({ domain: { ...saved.toObject(), status: "Pending" } }, 201);
  };

  verify = async (c: Context) => {
    const domainID = c.req.param("domainID");
    if (!domainID || !mongoose.isValidObjectId(domainID)) {
      return c.json({ message: "Invalid domain ID" }, 400);
    }

    const domain = await this.repository.findById(
      c.var.auth.organizationID,
      domainID,
    );
    if (!domain) {
      return c.json({ message: "Domain not found" }, 404);
    }

    const verification = await verifySesDomain(domain.domain);
    const status = getVerificationStatus(verification, domain.domain);
    const updated = await this.repository.updateVerification(
      c.var.auth.organizationID,
      domainID,
      status === "Success",
    );
    return c.json({ domain: { ...updated, status } });
  };
}

export const domainController = new DomainController(
  new DefaultDomainRepository(),
);
