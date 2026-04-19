import { Button, Heading, Section, Text } from '@react-email/components'

import { EmailLayout } from './components/EmailLayout'

export interface WelcomeEmailProps {
  firstName?: string
  unsubscribeUrl: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://letsfightglio.com'

export default function WelcomeEmail({ firstName, unsubscribeUrl }: WelcomeEmailProps) {
  const greeting = firstName ? `Welcome, ${firstName}!` : 'Welcome!'

  return (
    <EmailLayout
      preview="Welcome to the Let's Fight Glio community."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={h1}>{greeting}</Heading>
      <Text style={paragraph}>
        Thank you for joining the Let&apos;s Fight Glio community. We&apos;re a coalition of
        patients, families, doctors, and donors working to fund breakthrough research and support
        the people facing glioblastoma.
      </Text>
      <Text style={paragraph}>
        You&apos;ll hear from us when we have meaningful research updates, patient stories, and
        events. We won&apos;t crowd your inbox.
      </Text>

      <Section style={ctaSection}>
        <Button href={`${SITE_URL}/stories`} style={button}>
          Read patient stories
        </Button>
      </Section>

      <Text style={paragraph}>
        If you ever want to support the foundation directly, donations of any size go straight to
        research funding and family support — you can give at{' '}
        <a href={`${SITE_URL}/donate`} style={link}>
          letsfightglio.com/donate
        </a>
        .
      </Text>

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

const ctaSection: React.CSSProperties = {
  margin: '24px 0',
  textAlign: 'center',
}

const button: React.CSSProperties = {
  backgroundColor: '#7c3aed',
  borderRadius: '999px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
  padding: '12px 24px',
  textDecoration: 'none',
}

const link: React.CSSProperties = {
  color: '#5b21b6',
  textDecoration: 'underline',
}

const signature: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 0',
}
