// Bundled config: includes tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// nitro (build — cloudflare default), @ path alias, React/TanStack dedupe.
// Pass extra config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
