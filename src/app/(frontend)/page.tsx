import Link from 'next/link'

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            Glioblastoma research &amp; awareness
          </p>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s Fight Glio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We are a community of patients, families, doctors, and donors working to fund
            breakthrough research, support those affected by glioblastoma, and raise awareness for
            the most aggressive form of brain cancer.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
            >
              Donate now
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Our mission
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            501(c)(3) status pending — donations may become tax-deductible once approved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Fund research',
              body: 'Direct grants to laboratories pursuing novel therapies for glioblastoma.',
            },
            {
              title: 'Support families',
              body: 'Resources, community, and care for patients and their loved ones.',
            },
            {
              title: 'Raise awareness',
              body: 'Stories, education, and events that keep glioblastoma in the conversation.',
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
