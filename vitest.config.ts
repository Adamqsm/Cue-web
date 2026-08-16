import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// tsconfig's "@/*" paths don't reach vitest on their own. The lib modules
// under test kept to relative imports for exactly that reason; route-handler
// tests can't (route files themselves import via "@/"), so mirror the alias.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // tsconfig has jsx: "preserve" (Next/SWC territory), which esbuild maps to
  // the classic transform — component tests then crash on "React is not
  // defined". Match the app's automatic runtime instead.
  esbuild: { jsx: "automatic" },
});
