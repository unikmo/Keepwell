import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

const VERSION = "v1";

function encryptionKey() {
  const source = process.env.SENTINEL_ENCRYPTION_KEY;
  if (!source || source.length < 32) {
    throw new Error("Digital Sentinel secret storage is not configured.");
  }
  return createHash("sha256").update(source, "utf8").digest();
}

export function encryptSentinelSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decryptSentinelSecret(payload: string) {
  const [version, ivPart, tagPart, ciphertextPart] = payload.split(".");
  if (version !== VERSION || !ivPart || !tagPart || !ciphertextPart) throw new Error("Invalid Sentinel ciphertext.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivPart, "base64url"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}


export function createSentinelRevealToken(userId: string, itemId: string, ttlSeconds = 120) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${VERSION}:${userId}:${itemId}:${expires}`;
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  const signature = createHmac("sha256", encryptionKey()).update(encoded, "utf8").digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySentinelRevealToken(token: string, expectedUserId: string) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", encryptionKey()).update(encoded, "utf8").digest("base64url");
  const actualBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  const decoded = Buffer.from(encoded, "base64url").toString("utf8");
  const [version, userId, itemId, expiresRaw] = decoded.split(":");
  const expires = Number(expiresRaw);
  if (version !== VERSION || userId !== expectedUserId || !itemId || !Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return null;
  return { itemId, expires };
}
