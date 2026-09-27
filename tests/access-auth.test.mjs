import assert from 'node:assert/strict';
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose';
import { verifyAccessToken, accessIssuer } from '../app/lib/access-auth.ts';

const config = { ACCESS_TEAM_DOMAIN: 'https://lingualens-test.cloudflareaccess.com', ACCESS_AUD: 'pilot-audience' };
const { privateKey, publicKey } = await generateKeyPair('RS256');
const jwk = { ...await exportJWK(publicKey), kid: 'test', alg: 'RS256', use: 'sig' };
const keys = createLocalJWKSet({ keys: [jwk] });
const timestamp = Math.floor(Date.now()/1000);
const claims = { iss: config.ACCESS_TEAM_DOMAIN, aud: [config.ACCESS_AUD], sub: 'user-1', email: 'Learner@example.com', type: 'app', iat: timestamp, exp: timestamp+300 };
const sign = (overrides = {}, key = privateKey) => new SignJWT({ ...claims, ...overrides }).setProtectedHeader({ alg:'RS256', kid:'test' }).sign(key);
let checks=0;
function check(value, expected) { assert.deepEqual(value, expected); checks++; }
const valid = await verifyAccessToken(await sign(), config, keys);
check(valid.email, 'learner@example.com');
check(valid.userId, 'access:'+config.ACCESS_TEAM_DOMAIN+':user-1');
for (const overrides of [{iss:'https://evil.cloudflareaccess.com'}, {aud:['other-app']}, {exp:timestamp-1}, {exp:undefined}, {iat:undefined}, {nbf:timestamp+300}, {email:undefined}, {sub:undefined}, {type:'org'}]) {
    check(await verifyAccessToken(await sign(overrides), config, keys), null);
}
const otherKey = await generateKeyPair('RS256');
check(await verifyAccessToken(await sign({}, otherKey.privateKey), config, keys), null);
check(await verifyAccessToken('eyJhbGciOiJub25lIn0.e30.', config, keys), null);
check(await verifyAccessToken(null, config, keys), null);
check(await verifyAccessToken(await sign(), {}, keys), null);
check(await verifyAccessToken(await sign(), {...config, ACCESS_AUD:''}, keys), null);
check(accessIssuer({ACCESS_TEAM_DOMAIN:'https://evil.test/'}), null);
check(accessIssuer({ACCESS_TEAM_DOMAIN:'http://lingualens-test.cloudflareaccess.com'}), null);
check(accessIssuer({ACCESS_TEAM_DOMAIN:'https://lingualens-test.cloudflareaccess.com/'}), config.ACCESS_TEAM_DOMAIN);
console.log(`PASS ${checks} Access authentication checks (real RSA signatures).`);
