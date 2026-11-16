import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();
const bulkRecipientLimit = 50;

type TransactionalEmail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

type BulkEmailRecipient = {
  email: string;
  replacementTemplateData?: Record<string, unknown>;
};

type BulkEmail = {
  recipients: BulkEmailRecipient[];
  templateName: string;
  defaultTemplateData?: Record<string, unknown>;
  from?: string;
};

type EmailTemplate = {
  templateName: string;
  subject: string;
  html: string;
  text?: string;
};

const getSender = (from?: string) => {
  const sender = from ?? process.env.SES_FROM_EMAIL;
  if (!sender) {
    throw new Error("SES_FROM_EMAIL is required to send email");
  }
  return sender;
};

export function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  from,
}: TransactionalEmail) {
  return ses
    .sendEmail({
      Source: getSender(from),
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
        },
      },
    })
    .promise();
}

export async function sendBulkEmail({
  recipients,
  templateName,
  defaultTemplateData = {},
  from,
}: BulkEmail) {
  const results: AWS.SES.SendBulkTemplatedEmailResponse[] = [];
  for (let index = 0; index < recipients.length; index += bulkRecipientLimit) {
    const batch = recipients.slice(index, index + bulkRecipientLimit);
    const result = await ses
      .sendBulkTemplatedEmail({
        Source: getSender(from),
        Template: templateName,
        DefaultTemplateData: JSON.stringify(defaultTemplateData),
        Destinations: batch.map(({ email, replacementTemplateData }) => ({
          Destination: { ToAddresses: [email] },
          ReplacementTemplateData: JSON.stringify(
            replacementTemplateData ?? {},
          ),
        })),
      })
      .promise();
    results.push(result);
  }
  return results;
}

export function createTemplate({
  templateName,
  subject,
  html,
  text,
}: EmailTemplate) {
  return ses
    .createTemplate({
      Template: {
        TemplateName: templateName,
        SubjectPart: subject,
        HtmlPart: html,
        ...(text ? { TextPart: text } : {}),
      },
    })
    .promise();
}

export function getTemplate(templateName: string) {
  return ses
    .getTemplate({
      TemplateName: templateName,
    })
    .promise();
}
