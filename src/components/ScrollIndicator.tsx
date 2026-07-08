export function ScrollIndicator() {
  return (
    <div
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-600"
      aria-hidden="true"
    >
      <span className="scroll-chevron h-6 w-6 border-b border-r border-zinc-600" />
    </div>
  );
}
