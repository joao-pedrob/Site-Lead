import { mkdir, writeFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import server from '../dist/server/server.js';

// Export real SSR responses so every page also opens directly on static hosting.
const routes = ['/', '/servicos', '/sobre', '/contato', '/admin'];
for (const route of routes) {
  const response = await server.fetch(new Request(`https://site.local${route}`));
  assert.equal(response.status, 200, `Failed to render ${route}`);
  const html = await response.text();
  assert.match(html, /<html/, `Missing HTML on ${route}`);
  if (route !== '/admin') {
    assert.match(html, /Manutenção elétrica e a combustão/);
    assert.match(html, /<h1[\s>]/, `Missing page heading on ${route}`);
    for (const path of ['/servicos', '/sobre', '/contato']) {
      assert.ok(html.includes(`href="${path}"`), `Missing navigation ${path} on ${route}`);
    }
    assert.ok(!/href="#(?:servicos|contato|equipe|diferenciais|como-funciona)"/.test(html), `Stale section navigation on ${route}`);
  }
  const directory = `dist/client${route === '/' ? '' : route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
  console.log(`Exported and verified ${route}`);
}
