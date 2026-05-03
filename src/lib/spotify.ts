let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const id = process.env.SPOTIFY_CLIENT_ID!;
  const secret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to get Spotify token (${res.status}): ${body}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: string;
  albumArt: string | null;
  previewUrl: string | null;
};

function extractTrackId(input: string): string | null {
  input = input.trim();
  // Full URL: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
  const urlMatch = input.match(/spotify\.com\/track\/([A-Za-z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  // spotify:track:4uLU6hMCjMI75M1A2tKUQC
  const uriMatch = input.match(/spotify:track:([A-Za-z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  // bare ID
  if (/^[A-Za-z0-9]{22}$/.test(input)) return input;
  return null;
}

export async function resolveSpotifyTrack(input: string): Promise<SpotifyTrack> {
  const id = extractTrackId(input);
  if (!id) throw new Error("Not a valid Spotify track URL or ID.");

  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) throw new Error("Track not found on Spotify.");
  if (!res.ok) throw new Error("Spotify API error.");

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    artists: data.artists.map((a: { name: string }) => a.name).join(", "),
    albumArt: data.album?.images?.[0]?.url ?? null,
    previewUrl: data.preview_url ?? null,
  };
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  if (!query.trim()) return [];
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.tracks?.items ?? []).map((t: {
    id: string; name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string | null;
  }) => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map((a) => a.name).join(", "),
    albumArt: t.album?.images?.[0]?.url ?? null,
    previewUrl: t.preview_url ?? null,
  }));
}
