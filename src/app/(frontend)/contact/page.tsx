import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    "Get in touch with the Let's Fight Glio Foundation team — for partnership inquiries, press, donor questions, and patient support.",
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground">
          Questions, partnership ideas, or stories to share — send us a message and a member of
          our team will get back to you within a few business days.
        </p>
      </header>

      <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <ContactForm />
      </div>
    </section>
  )
}
