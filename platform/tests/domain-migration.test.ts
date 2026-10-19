import assert from 'node:assert/strict';
import test from 'node:test';
import { unstable_getResponseFromNextConfig } from 'next/experimental/testing/server.js';
import nextConfig from '../next.config.ts';

for (const host of ['xn--bkestudo-zkb.com', 'www.xn--bkestudo-zkb.com']) {
  for (const path of ['/', '/designs/nocturne-lake-estate', '/tr/designs/blush-garden-rose', '/start/demo/velvet-jewel-box/home', '/edit/domain-test?k=test-only%2Bkey&lang=tr', '/api/edit/domain-test?probe=1']) {
    test(`legacy domain retains path and query: ${host}${path}`, async () => {
      const response = await unstable_getResponseFromNextConfig({ url: `https://${host}${path}`, nextConfig });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get('location'), `https://bkestudio.com${path}`);
    });
  }
}
for (const host of ['bkestudio.com', 'localhost:3000', 'davetiye-maker.vercel.app', 'xn--bkestudo-zkb.com.example.org', 'wwwx.xn--bkestudo-zkb.com']) {
  test(`primary, preview and unrelated hosts do not redirect: ${host}`, async () => {
    const response = await unstable_getResponseFromNextConfig({ url: `https://${host}/admin`, nextConfig });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
  });
}
