export function normalizeHashtags(value: string): string {
  const tags = value
    .split(/[\s,]+/)
    .map((tag) => tag.trim().replace(/^#+/, "").replace(/[^a-zA-Z0-9_-]/g, ""))
    .filter(Boolean);

  return Array.from(new Set(tags.map((tag) => tag.toLowerCase())))
    .slice(0, 15)
    .map((tag) => `#${tag}`)
    .join(" ");
}

export function parseHashtags(value?: string | null): string[] {
  return normalizeHashtags(value ?? "").split(" ").filter(Boolean);
}

export function extractHashtags(value?: string | null): string[] {
  if (!value) return [];
  return Array.from(new Set((value.match(/#[a-zA-Z0-9_-]+/g) ?? []).map((tag) => tag.toLowerCase()))).slice(0, 15);
}

export function getDisplayHashtags(stored?: string | null, fallbackText?: string | null): string[] {
  const saved = parseHashtags(stored);
  return saved.length > 0 ? saved : extractHashtags(fallbackText);
}
