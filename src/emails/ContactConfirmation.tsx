import { Heading, Section, Text } from '@react-email/components'

import { EmailLayout } from './components/EmailLayout'

export interface ContactConfirmationProps {
  fromName: string
  subject: string
  message: string
}

export default function ContactConfirmation({
  fromName,
  subject,
  message,
}: ContactConfirmationProps) {
  return (
    <EmailLayout preview="We received your message at Let's Fight Glio.">
      <Heading style={h1}>We received your message</Heading>
      <Text style={paragraph}>Hi {fromName.split(' ')[0]},</Text>
      <Text style={paragraph}>
        Thank you for reaching out to Let&apos;s Fight Glio. A member of our team will get back to
        you as soon as possible — typically within a few business days.
      </Text>

      <Section style={messageBox}>
        <Text style={messageLabel}>Your message</Text>
        <Text style={messageMeta}>
          <strong>Subject:</strong> {subject}
        </Text>
        <Text style={messageBody}>{message}</Text>
      </Section>

      <Text style={signature}>
        With gratitude,
        <br />
        The Let&apos;s Fight Glio team
      </Text>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = {
  color: '#5b21b6',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const paragraph: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const messageBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '16px 0',
  padding: '16px 20px',
}

const messageLabel: React.CSSProperties = {
  color: '#5b21b6',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const messageMeta: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '13px',
  margin: '0 0 8px',
}

const messageBody: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}

const signature: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 0',
}
