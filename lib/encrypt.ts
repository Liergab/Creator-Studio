import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;
const PREFIX = "enc:";

function getKey(): Buffer | null {
  const raw = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!raw?.trim()) return null;
  const buf = Buffer.from(raw.trim(), "utf8");
  if (buf.length >= KEY_LEN) return buf.subarray(0, KEY_LEN);
  return scryptSync(buf, "creator-studio-token-salt", KEY_LEN);
}

/**
 * Encrypts a string (e.g. OAuth access token) for storage.
 * Returns "enc:" + base64(iv + ciphertext + authTag), or the plain text if no key is set.
 */
export function encryptToken(plain: string): string {
  const key = getKey();
  if (!key) return plain;

  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv, { authTagLength: TAG_LEN });
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, enc, tag]);
  return PREFIX + combined.toString("base64");
}

/**
 * Decrypts a string stored by encryptToken.
 * If the value does not start with "enc:", returns it as-is (plaintext).
 */
export function decryptToken(stored: string): string {
  if (!stored?.startsWith(PREFIX)) return stored ?? "";

  const key = getKey();
  if (!key) return ""; // Cannot decrypt without key; caller will get "Connect Instagram"

  try {
    const combined = Buffer.from(stored.slice(PREFIX.length), "base64");
    const iv = combined.subarray(0, IV_LEN);
    const tag = combined.subarray(combined.length - TAG_LEN);
    const ciphertext = combined.subarray(IV_LEN, combined.length - TAG_LEN);
    const decipher = createDecipheriv(ALGO, key, iv, {
      authTagLength: TAG_LEN,
    });
    decipher.setAuthTag(tag);
    return decipher.update(ciphertext) + decipher.final("utf8");
  } catch {
    return stored;
  }
}
