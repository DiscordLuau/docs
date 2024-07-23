import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: deno(),
	image: {
		service: passthroughImageService(),
	},
	integrations: [
		starlight({
			title: "Discord Luau",
			logo: {
				light: "/src/assets/banner-light.png",
				dark: "/src/assets/banner-dark.png",
				replacesTitle: true,
			},
			favicon: "src/assets/favicon.png",
			social: {
				github: "https://github.com/DiscordLuau/discord-luau",
			},
			sidebar: [
				{
					label: "Getting Started",
					autogenerate: {
						directory: "getting-started",
					},
				},
				{
					label: "Guides",
					autogenerate: {
						directory: "guides",
					},
				},
				{
					label: "Classes",
					autogenerate: {
						directory: "classes",
					},
				},
			],
			customCss: [
				"./src/styles/landing.css",
				"./src/styles/starlight.css",
				"./src/styles/lua.css",
			],
			components: {
				Hero: "./src/components/Hero.astro",
				Pagination: "./src/components/Pagination.astro",
			},
		}),
	],
});
