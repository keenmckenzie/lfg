import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { ReactNode } from 'react'

interface EmailLayoutProps {
  preview: string
  children: ReactNode
  unsubscribeUrl?: string
  organizationAddress?: string
}

const ORG_NAME = "Let's Fight Glio Foundation"
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://letsfightglio.com'
const DEFAULT_ADDRESS = 'Let\'s Fight Glio Foundation'

export function EmailLayout({
  preview,
  children,
  unsubscribeUrl,
  organizationAddress = DEFAULT_ADDRESS,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Link href={SITE_URL} style={brand}>
              {ORG_NAME}
            </Link>
          </Section>

          <Section style={content}>{children}</Section>

          <Section style={footer}>
            <Text style={footerText}>
              {organizationAddress}
              <br />
              <Link href={SITE_URL} style={footerLink}>
                letsfightglio.com
              </Link>
              {unsubscribeUrl && (
                <>
                  {' · '}
                  <Link href={unsubscribeUrl} style={footerLink}>
                    Unsubscribe
                  </Link>
                </>
              )}
            </Text>
            <Text style={footerSmall}>
              {ORG_NAME} has applied for 501(c)(3) tax-exempt status.
            </Text>
          </Section>
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
  margin: '0 auto',
  maxWidth: '560px',
  width: '100%',
}

const header: React.CSSProperties = {
  backgroundColor: '#5b21b6',
  borderRadius: '12px 12px 0 0',
  padding: '20px 32px',
}

const brand: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  textDecoration: 'none',
}

const content: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderTop: 'none',
  padding: '32px',
}

const footer: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '0 0 12px 12px',
  borderTop: 'none',
  padding: '20px 32px',
}

const footerText: React.CSSProperties = {
  color: '#475569',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px',
}

const footerLink: React.CSSProperties = {
  color: '#5b21b6',
  textDecoration: 'underline',
}

const footerSmall: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '16px',
  margin: 0,
}
