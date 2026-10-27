export interface Auth {
  email: string;
  password: string;
  fullname: string;
  organization: string;
  organizationID: string;
}

export interface Domain {
  organizationId: string;
  domain: string;
  isVerify: boolean;
  newsletterMail: string;
}

export interface Logs {
  email: string;
  status: string;
  timeStamp: string;
  retries: string;
  organizationId: string;
}

export interface Subscribers {
  email: string;
  topicsubscriber?: string;
  isActive: boolean;
  isVerified: boolean;
  organizationId: string;
}

export interface Topic {
  topicName: string;
  status: string;
  organizationID?: string;
}
