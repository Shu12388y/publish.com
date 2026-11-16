import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

export function addDomain(domain: string) {
  return ses
    .verifyDomainIdentity({
      Domain: domain,
    })
    .promise();
}

export function verifyDomain(domain: string) {
  return ses
    .getIdentityVerificationAttributes({
      Identities: [domain],
    })
    .promise();
}

export function addEmail(email: string) {
  return ses
    .verifyEmailIdentity({
      EmailAddress: email,
    })
    .promise();
}

export function verifyEmail(email: string) {
  return ses
    .getIdentityVerificationAttributes({
      Identities: [email],
    })
    .promise();
}
