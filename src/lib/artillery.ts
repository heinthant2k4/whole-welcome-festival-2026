export async function getArtilleryToken() {
  if (typeof window === "undefined") {
    return `v1.${Date.now()}.server`;
  }

  const cached = window.sessionStorage.getItem("artilleryToken");
  if (cached) {
    const parts = cached.split(".");
    if (parts.length >= 3 && parts[0] === "v1") {
      const issuedAt = Number(parts[1]);
      if (Number.isFinite(issuedAt) && Date.now() - issuedAt < 5 * 60 * 1000) {
        return cached;
      }
    }
  }

  const seedBytes = new Uint32Array(1);
  window.crypto.getRandomValues(seedBytes);
  const seed = seedBytes[0].toString(16);
  const issuedAt = Date.now();
  const base = `${issuedAt}.${seed}.`;
  const mask = (1 << 12) - 1;
  let nonce = 0;
  let hash = 0;

  while (true) {
    hash = fnv1a32(base + nonce);
    if ((hash & mask) === 0) {
      break;
    }
    nonce += 1;
  }

  const token = `v1.${issuedAt}.${seed}.${nonce}.${hash.toString(16)}`;
  window.sessionStorage.setItem("artilleryToken", token);
  return token;
}

function fnv1a32(input: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
