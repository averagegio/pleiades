import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 8, 2026">
      <section>
        <h2 className="text-lg font-medium text-zinc-50">Overview</h2>
        <p>
          Pleiades is a private personal journal for your own observations about
          people in your life. We collect only what we need to run the app. We
          do not sell your data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">What we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-200">Account info</strong> — email and
            password if you create an account (optional in early versions).
          </li>
          <li>
            <strong className="text-zinc-200">Your stars</strong> — nicknames,
            notes, orbit assignments, and brightness you enter. Stored locally on
            your device until cloud sync is enabled.
          </li>
          <li>
            <strong className="text-zinc-200">Technical logs</strong> — basic
            diagnostics (errors, device type) to keep the app running.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">What we do not collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Real-time location of other people</li>
          <li>Photos or biometrics of non-consenting individuals</li>
          <li>A shared database of identifiable people across users</li>
          <li>Social media scraping or background checks</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">How we use data</h2>
        <p>
          Your stars and notes are used only to provide the app to you. We do not
          use your note content for advertising. We do not train AI models on
          your private entries without explicit consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Storage & retention</h2>
        <p>
          In the current version, data is stored in your browser&apos;s
          local storage. You can delete any star at any time. When you delete
          your account (future feature), we will remove your data within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          export, or delete your data. Contact us at privacy@pleiades.app for
          requests.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Children</h2>
        <p>
          Pleiades is not intended for children under 13. If you are under 13,
          please do not use the app.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Changes</h2>
        <p>
          We may update this policy. We will post the new date at the top of
          this page. Continued use after changes means you accept the updated
          policy.
        </p>
      </section>
    </LegalLayout>
  );
}
