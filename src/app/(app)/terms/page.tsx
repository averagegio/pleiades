import { LegalLayout } from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 8, 2026">
      <section>
        <h2 className="text-lg font-medium text-zinc-50">Agreement</h2>
        <p>
          By using Pleiades, you agree to these Terms. Pleiades is a private
          personal journal app — not a surveillance, people-search, or
          harassment tool.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Eligibility</h2>
        <p>
          You must be at least 13 years old to use Pleiades. You are responsible
          for complying with laws in your jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Acceptable use</h2>
        <p>You agree not to use Pleiades to:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Stalk, harass, threaten, or intimidate anyone</li>
          <li>Collect or share private information (doxxing) about others</li>
          <li>Record or monitor people without consent where illegal</li>
          <li>Impersonate others or publish defamatory content intended to harm</li>
          <li>Build a public directory of non-consenting individuals</li>
          <li>Violate any applicable law or third-party rights</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Your content</h2>
        <p>
          You own the notes and entries you create. You are solely responsible
          for what you write. Pleiades does not review your private entries by
          default, but we may act if we receive credible reports of illegal use.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Sister orbits</h2>
        <p>
          The seven sister orbits (Core, Nurture, Sparks, Distant, Archive,
          Public sky, Hidden) are organizational tools. The Public sky orbit is
          for public figures only. The Hidden orbit is for your private use and
          does not grant permission to store illegal content.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Disclaimer</h2>
        <p>
          Pleiades is provided &quot;as is&quot; without warranties. We are not
          liable for how you use the app or for indirect damages to the extent
          permitted by law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms. You may
          stop using the app at any time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Contact</h2>
        <p>
          Questions about these Terms: legal@pleiades.app
        </p>
      </section>
    </LegalLayout>
  );
}
