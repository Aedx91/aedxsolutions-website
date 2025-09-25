// Ensure Lightning CSS works in environments without native binaries (e.g., Vercel build)
// We prefer WASM fallback by setting LIGHTNINGCSS_FORCE_WASM=1 via build script.
// No explicit import is required here; dependency presence is enough.
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
