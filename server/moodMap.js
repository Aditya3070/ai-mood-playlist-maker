// Map mood words → Spotify search queries + descriptors
export function moodToQuery(moodInput) {
  const text = (moodInput || "").toLowerCase();
  const presets = [
    { key: "happy", query: "feel good pop upbeat", emoji: "😄" },
    { key: "sad", query: "sad acoustic mellow", emoji: "😢" },
    { key: "chill", query: "lofi chill beats relax", emoji: "🧊" },
    { key: "energetic", query: "high energy edm workout", emoji: "⚡" },
    { key: "romantic", query: "romantic r&b love", emoji: "💖" },
    { key: "nostalgic", query: "90s nostalgic indie", emoji: "📼" },
    { key: "focus", query: "instrumental focus study", emoji: "🎧" },
    { key: "rainy", query: "rainy day jazz cafe", emoji: "🌧️" },
    { key: "moody", query: "moody alt pop dark", emoji: "🌙" }
  ];

  const match =
    presets.find(p => text.includes(p.key)) ||
    { query: `${moodInput} vibe`, emoji: "🎵" };

  return match;
}
