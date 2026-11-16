import { Domain } from "@publish.com/database/db";

export type CreateDomain = {
  organizationId: string;
  domain: string;
  verificationToken?: string;
};

export class DomainRepository {
  findAllByOrganization(organizationId: string) {
    return Domain.find({ organizationId }).sort({ createdAt: -1 }).lean();
  }

  findById(organizationId: string, domainID: string) {
    return Domain.findOne({ _id: domainID, organizationId });
  }

  findByDomain(organizationId: string, domain: string) {
    return Domain.findOne({ organizationId, domain });
  }

  create(domain: CreateDomain) {
    return Domain.create(domain);
  }

  updateVerification(
    organizationId: string,
    domainID: string,
    isVerify: boolean,
  ) {
    return Domain.findOneAndUpdate(
      { _id: domainID, organizationId },
      { $set: { isVerify } },
      { new: true },
    ).lean();
  }
}
