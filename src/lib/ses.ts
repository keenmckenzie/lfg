import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials:
    process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
      : undefined,
})

interface SendEmailArgs {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  const from = process.env.AWS_SES_FROM_EMAIL
  if (!from) {
    throw new Error('AWS_SES_FROM_EMAIL is not configured.')
  }

  const command = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: html, Charset: 'UTF-8' },
        ...(text ? { Text: { Data: text, Charset: 'UTF-8' } } : {}),
      },
    },
  })

  return ses.send(command)
}
