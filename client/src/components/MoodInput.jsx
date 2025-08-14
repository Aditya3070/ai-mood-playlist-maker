import { useState } from "react";

export default function MoodInput({ onSubmit }) {
  const [mood, setMood] = useState("");

  return (
    <div className="card">
      <label className="block text-sm mb-2 opacity-80">Type your mood</label>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-3 rounded-lg bg-black/30 outline-none"
          placeholder="happy, nostalgic, chill evening…"
          value={mood}
          onChange={e => setMood(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit(mood)}
        />
        <button
          onClick={() => onSubmit(mood)}
          className="px-4 py-3 rounded-lg bg-green-500 text-black font-semibold"
        >
          Generate 🎶
        </button>
      </div>
      <div className="text-xs mt-2 opacity-70">Tip: try “nostalgic 90s”, “rainy chill”, “energetic gym”</div>
    </div>
  );
}
