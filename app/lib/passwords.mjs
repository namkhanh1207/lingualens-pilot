import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export const tokenHash = value => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const key = await scrypt(password, salt, 32, options);
    return `scrypt-v1:${salt}:${key.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
    const [version, salt, hex] = String(stored).split(':');
    if (version !== 'scrypt-v1' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{64}$/.test(hex)) return false;
    const key = await scrypt(password, salt, 32, options);
    return timingSafeEqual(key, Buffer.from(hex, 'hex'));
}
// Unknown accounts still incur the same password verification cost.
export const dummyPasswordHash = 'scrypt-v1:' + '0'.repeat(32) + ':' + '0'.repeat(64);
