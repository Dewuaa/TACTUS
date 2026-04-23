import Link from "next/link";

export default function NotFound() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-tactus-black px-8 text-center">
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
        TACTUS
      </p>
      <h1
        className="text-3xl font-black tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        This moment wasn&rsquo;t found.
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-white/40">
        The link may be mistyped, or this keychain hasn&rsquo;t been set up yet.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full border border-white/15 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
      >
        Back to TACTUS
      </Link>
    </main>
  );
}
