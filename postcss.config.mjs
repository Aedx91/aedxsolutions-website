// Ensure Lightning CSS works in environments without native binaries (e.g., Vercel build)
// PostCSS/Tailwind will resolve lightningcss through the environment; adding lightningcss-wasm avoids native .node lookups
// No explicit import is required here; dependency presence is enough.
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
