import type { Match } from '@beach-tennis-scout/domain';

const KEY = 'bts:matches';
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function reviver(_k: string, v: unknown): unknown {
  if (typeof v === 'string' && ISO_RE.test(v)) return new Date(v);
  return v;
}

export function loadMatches(): Match[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw, reviver) as Match[]) : [];
  } catch {
    return [];
  }
}

export function loadMatch(id: string): Match | undefined {
  return loadMatches().find((m) => m.id === id);
}

export function saveMatch(match: Match): void {
  const all = loadMatches();
  const idx = all.findIndex((m) => m.id === match.id);
  if (idx >= 0) all[idx] = match;
  else all.push(match);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteMatch(id: string): void {
  const all = loadMatches().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
