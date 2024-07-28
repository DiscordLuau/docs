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
				src: "/src/assets/logo.png",
				replacesTitle: true,
			},
			favicon: "src/assets/icon.png",
			social: {
				github: "https://github.com/DiscordLuau/discord-luau",
				discord: "https://discord.gg/DpQwdD8zD3",
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
				Pagination: "./src/components/Pagination.astro",
				Header: "./src/components/Header.astro",
			},
		}),
	],
});
