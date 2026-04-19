import { render } from '@react-email/render'

import ContactConfirmation, {
  type ContactConfirmationProps,
} from '@/emails/ContactConfirmation'
import ContactInquiry, { type ContactInquiryProps } from '@/emails/ContactInquiry'
import WelcomeEmail, { type WelcomeEmailProps } from '@/emails/WelcomeEmail'
import { sendEmail } from '@/lib/ses'
import { buildUnsubscribeUrl } from '@/lib/unsubscribe'

export async function sendWelcomeEmail(params: { to: string; firstName?: string }) {
  const unsubscribeUrl = buildUnsubscribeUrl(params.to)
  const props: WelcomeEmailProps = {
    firstName: params.firstName,
    unsubscribeUrl,
  }

  const html = await render(WelcomeEmail(props))
  const text = await render(WelcomeEmail(props), { plainText: true })

  return sendEmail({
    to: params.to,
    subject: "Welcome to Let's Fight Glio",
    html,
    text,
  })
}

interface ContactArgs {
  fromName: string
  fromEmail: string
  subject: string
  message: string
  toAdmin: string
}

export async function sendContactEmails({
  fromName,
  fromEmail,
  subject,
  message,
  toAdmin,
}: ContactArgs) {
  const submittedAt = new Date()

  const inquiryProps: ContactInquiryProps = {
    fromName,
    fromEmail,
    subject,
    message,
    submittedAt,
  }
  const inquiryHtml = await render(ContactInquiry(inquiryProps))
  const inquiryText = await render(ContactInquiry(inquiryProps), { plainText: true })

  const confirmationProps: ContactConfirmationProps = { fromName, subject, message }
  const confirmationHtml = await render(ContactConfirmation(confirmationProps))
  const confirmationText = await render(ContactConfirmation(confirmationProps), {
    plainText: true,
  })

  await Promise.all([
    sendEmail({
      to: toAdmin,
      subject: `New inquiry: ${subject}`,
      html: inquiryHtml,
      text: inquiryText,
      replyTo: fromEmail,
    }),
    sendEmail({
      to: fromEmail,
      subject: 'We received your message',
      html: confirmationHtml,
      text: confirmationText,
    }),
  ])
}
