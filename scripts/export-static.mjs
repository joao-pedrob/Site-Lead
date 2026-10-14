import { mkdir, writeFile } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import server from '../dist/server/server.js';

// Export real SSR responses so every page also opens directly on static hosting.
const routes = ['/', '/admin'];
for (const route of routes) {
  const response = await server.fetch(new Request(`https://site.local${route}`));
  assert.equal(response.status, 200, `Failed to render ${route}`);
  const html = await response.text();
  assert.match(html, /<html/, `Missing HTML on ${route}`);
  if (route !== '/admin') {
    assert.match(html, /Manutenção elétrica e a combustão/);
    assert.match(html, /<h1[\s>]/, `Missing page heading on ${route}`);
    for (const path of ['/#servicos', '/#diferenciais', '/#contato']) {
      assert.ok(html.includes(`href="${path}"`), `Missing navigation ${path} on ${route}`);
    }
    for (const id of ['servicos', 'como-funciona', 'diferenciais', 'equipe', 'contato']) assert.ok(html.includes(`id="${id}"`), `Missing section ${id}`);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'Expected one primary heading');
  }
  const directory = `dist/client${route === '/' ? '' : route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
  console.log(`Exported and verified ${route}`);
}

for (const [path, hash] of [["servicos", "servicos"], ["sobre", "diferenciais"], ["contato", "contato"]]) {
  const response = await server.fetch(new Request(`https://site.local/${path}`));
  assert.ok(response.status >= 300 && response.status < 400);
  assert.equal(response.headers.get("location"), `/#${hash}`);
  const directory = `dist/client/${path}`;
  await mkdir(directory, {recursive: true});
  await writeFile(`${directory}/index.html`, `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/#${hash}"><title>Redirecionando</title></head><body><a href="/#${hash}">Continuar</a></body></html>`);
  console.log(`Verified redirect /${path} to /#${hash}`);
}
