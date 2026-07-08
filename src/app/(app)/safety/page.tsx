import { LegalLayout } from "@/components/LegalLayout";

export default function SafetyPage() {
  return (
    <LegalLayout title="Safety" updated="July 8, 2026">
      <section>
        <h2 className="text-lg font-medium text-zinc-50">Our stance</h2>
        <p>
          Pleiades is for curiosity and reflection — not surveillance.
          &quot;People watching&quot; here means noticing interesting humans in
          your own life and remembering them privately. It does not mean
          following, harassing, or collecting private information about anyone.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">What&apos;s OK</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Private notes about people you met (nickname, where you met, vibe)</li>
          <li>Remembering public figures you follow for inspiration</li>
          <li>Organizing your social world into sister orbits</li>
          <li>Archiving stars you no longer think about</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">What&apos;s not OK</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Tracking someone&apos;s location, schedule, or private life</li>
          <li>Storing home addresses, phone numbers, or workplace details to target someone</li>
          <li>Sharing another person&apos;s private information</li>
          <li>Using Pleiades to plan harassment or harm</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">The seven sisters</h2>
        <p>
          Each sister orbit has a purpose. Use <strong className="text-zinc-200">Sterope (Public sky)</strong> only
          for public personas. Use <strong className="text-zinc-200">Merope (Hidden)</strong> for
          extra privacy on your device — not for hiding illegal activity.
          Use <strong className="text-zinc-200">Celaeno (Archive)</strong> to let stars fade
          instead of deleting memories you might want later.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">Report a concern</h2>
        <p>
          If you believe someone is using Pleiades to harm others, contact{" "}
          <span className="text-zinc-200">safety@pleiades.app</span>. For
          emergencies, contact local authorities.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-zinc-50">A kind rule</h2>
        <p className="border-l-2 border-white/20 pl-4 text-zinc-400 italic">
          If you wouldn&apos;t say it to their face in a kind way, don&apos;t put
          it here.
        </p>
      </section>
    </LegalLayout>
  );
}
