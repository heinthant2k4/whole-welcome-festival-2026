import FingerprintJS from "@fingerprintjs/fingerprintjs";

/**
 * Generates a stable, anonymous device fingerprint.
 * No personal data is collected.
 */
export async function getFingerprintHash(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}
