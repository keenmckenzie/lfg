import { Heading, Hr, Section, Text } from '@react-email/components'

import { EmailLayout } from './components/EmailLayout'

export interface ContactInquiryProps {
  fromName: string
  fromEmail: string
  subject: string
  message: string
  submittedAt: Date
}

export default function ContactInquiry({
  fromName,
  fromEmail,
  subject,
  message,
  submittedAt,
}: ContactInquiryProps) {
  const formattedDate = submittedAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <EmailLayout preview={`New inquiry from ${fromName}: ${subject}`}>
      <Heading style={h1}>New contact form submission</Heading>

      <Section style={metaBox}>
        <Text style={metaRow}>
          <strong>From:</strong> {fromName} &lt;{fromEmail}&gt;
        </Text>
        <Text style={metaRow}>
          <strong>Subject:</strong> {subject}
        </Text>
        <Text style={metaRow}>
          <strong>Submitted:</strong> {formattedDate}
        </Text>
      </Section>

      <Hr style={hr} />

      <Text style={messageBlock}>{message}</Text>

      <Hr style={hr} />

      <Text style={small}>
        Reply directly to this email to respond — the From address has been set to the sender&apos;s
        email so your reply will reach them.
      </Text>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = {
  color: '#5b21b6',
  fontSize: '20px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const metaBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '0 0 16px',
  padding: '12px 16px',
}

const metaRow: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '2px 0',
}

const messageBlock: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '12px 0',
  whiteSpace: 'pre-wrap' as const,
}

const hr: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
}

const small: React.CSSProperties = {
  color: '#475569',
  fontSize: '12px',
  lineHeight: '18px',
  margin: 0,
}
