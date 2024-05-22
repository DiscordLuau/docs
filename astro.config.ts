import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: deno(),
  integrations: [
    starlight({
      title: "DiscordLuau Docs",
      social: {
        github: "https://github.com/DiscordLuau/discord-luau",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", link: "/guides/example/" },
          ],
        },
        {
          label: "Classes",
          autogenerate: { directory: "classes" },
        },
      ],
    }),
  ],
});