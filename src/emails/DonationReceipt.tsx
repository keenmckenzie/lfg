import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { formatCents } from '@/lib/utils'

export interface DonationReceiptProps {
  donorName?: string
  amountInCents: number
  currency: string
  recurring: boolean
  inMemoryOf?: string
  inHonorOf?: string
  donationDate: Date
  receiptId: string
}

export default function DonationReceipt({
  donorName,
  amountInCents,
  currency,
  recurring,
  inMemoryOf,
  inHonorOf,
  donationDate,
  receiptId,
}: DonationReceiptProps) {
  const formattedAmount = formatCents(amountInCents, currency.toUpperCase())
  const formattedDate = donationDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const greeting = donorName ? `Dear ${donorName},` : 'Hello,'

  return (
    <Html>
      <Head />
      <Preview>
        Thank you for your {recurring ? 'recurring monthly' : ''} donation of {formattedAmount} to
        Let&apos;s Fight Glio.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your donation</Heading>
          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            Thank you for your {recurring ? 'recurring monthly ' : ''}gift of{' '}
            <strong>{formattedAmount}</strong> to the Let&apos;s Fight Glio Foundation. Your
            support directly funds glioblastoma research, awareness, and care for the families
            facing this disease.
          </Text>

          <Section style={receiptBox}>
            <Text style={receiptRow}>
              <strong>Amount:</strong> {formattedAmount}
            </Text>
            <Text style={receiptRow}>
              <strong>Type:</strong> {recurring ? 'Monthly recurring' : 'One-time'}
            </Text>
            <Text style={receiptRow}>
              <strong>Date:</strong> {formattedDate}
            </Text>
            <Text style={receiptRow}>
              <strong>Receipt ID:</strong> {receiptId}
            </Text>
            {inMemoryOf && (
              <Text style={receiptRow}>
                <strong>In memory of:</strong> {inMemoryOf}
              </Text>
            )}
            {inHonorOf && (
              <Text style={receiptRow}>
                <strong>In honor of:</strong> {inHonorOf}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={small}>
            <strong>Tax-deductibility notice:</strong> Let&apos;s Fight Glio has applied for
            501(c)(3) tax-exempt status. Once approved, your donation may be tax-deductible
            retroactive to our date of incorporation. Please retain this receipt for your records.
          </Text>

          {recurring && (
            <Text style={small}>
              You can update or cancel your monthly donation at any time by replying to this email.
            </Text>
          )}

          <Text style={signature}>
            With gratitude,
            <br />
            The Let&apos;s Fight Glio team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif',
  margin: 0,
  padding: '32px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '40px 32px',
  border: '1px solid #e2e8f0',
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

const receiptBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '16px 0',
  padding: '16px 20px',
}

const receiptRow: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
}

const hr: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

const small: React.CSSProperties = {
  color: '#475569',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 12px',
}

const signature: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 0',
}
