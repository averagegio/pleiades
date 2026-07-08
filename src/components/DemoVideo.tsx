type DemoVideoProps = {
  title: string;
  description: string;
  src: string;
  poster?: string;
};

export function DemoVideo({ title, description, src, poster }: DemoVideoProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <video
          className="aspect-video w-full bg-black object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
