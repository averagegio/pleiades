"use client";

import { useSpeechToText } from "@/lib/use-speech-to-text";

type NoteFieldWithVoiceProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

export function NoteFieldWithVoice({
  value,
  onChange,
  placeholder = "Your private note (optional)",
}: NoteFieldWithVoiceProps) {
  const { supported, listening, toggle } = useSpeechToText();

  function appendTranscript(transcript: string) {
    onChange(value.trim() ? `${value.trim()} ${transcript}` : transcript);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Note"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-transparent px-3 text-base text-zinc-50 outline-none focus:border-white/25"
      />
      {supported && (
        <button
          type="button"
          onClick={() => toggle(appendTranscript)}
          aria-label={listening ? "Stop voice note" : "Dictate note"}
          aria-pressed={listening}
          title={listening ? "Stop listening" : "Dictate note"}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            listening
              ? "border-sky-400/50 bg-sky-400/15 text-sky-200"
              : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200"
          }`}
        >
          <MicIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
