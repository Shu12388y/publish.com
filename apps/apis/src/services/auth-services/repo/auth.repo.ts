import {Auth} from "@publish.com/database/db";

export type CreateAuthUser = {
  email: string;
  password: string;
  fullname: string;
  organization: string;
  organizationID: string;
};

export class AuthRepository {
  findByEmail(email: string) {
    return Auth.findOne({email});
  }

  findByEmailOrOrganization(email: string, organization: string) {
    return Auth.findOne({$or: [{email}, {organization}]});
  }

  createUser(user: CreateAuthUser) {
    return Auth.create(user);
  }
}
