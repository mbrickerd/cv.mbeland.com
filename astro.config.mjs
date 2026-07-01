import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://cv.mbeland.com",
  integrations: [react()],
});
