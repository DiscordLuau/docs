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
			favicon: "/icon.png",
			social: [
				{ icon: "github", label: "GitHub", href: "https://github.com/DiscordLuau/discord-luau" },
				{ icon: "discord", label: "Discord", href: "https://discord.gg/DpQwdD8zD3" },
			],
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
				// Core - what most consumers interact with directly
				{
					label: "Discord Luau",
					collapsed: false,
					autogenerate: { directory: "classes/discordluau", collapsed: true },
				},
				{
					label: "Classes",
					collapsed: false,
					autogenerate: { directory: "classes/classes", collapsed: true },
				},
				{
					label: "Builders",
					collapsed: false,
					autogenerate: { directory: "classes/builders", collapsed: true },
				},
				{
					label: "Types",
					collapsed: false,
					autogenerate: { directory: "classes/types", collapsed: true },
				},
				{
					label: "Rest",
					collapsed: false,
					autogenerate: { directory: "classes/rest", collapsed: true },
				},
				// Secondary - feature areas
				{
					label: "Voice",
					collapsed: false,
					autogenerate: { directory: "classes/voice", collapsed: true },
				},
				{
					label: "Opus",
					collapsed: false,
					autogenerate: { directory: "classes/opus", collapsed: true },
				},
				{
					label: "Sodium",
					collapsed: false,
					autogenerate: { directory: "classes/sodium", collapsed: true },
				},
				{
					label: "Dave",
					collapsed: false,
					autogenerate: { directory: "classes/dave", collapsed: true },
				},
				{
					label: "Accumulator",
					collapsed: false,
					autogenerate: { directory: "classes/accumulator", collapsed: true },
				},
				{
					label: "State",
					collapsed: false,
					autogenerate: { directory: "classes/state", collapsed: true },
				},
				{
					label: "Emitter",
					collapsed: false,
					autogenerate: { directory: "classes/emitter", collapsed: true },
				},
				{
					label: "Utilities",
					collapsed: false,
					autogenerate: { directory: "classes/utilities", collapsed: true },
				},
				// Internal / infrastructure
				{
					label: "Snowflake",
					collapsed: false,
					autogenerate: { directory: "classes/snowflake", collapsed: true },
				},
				{
					label: "Logger",
					collapsed: false,
					autogenerate: { directory: "classes/logger", collapsed: true },
				},
				{
					label: "Formdata",
					collapsed: false,
					autogenerate: { directory: "classes/formdata", collapsed: true },
				},
				{
					label: "Stream",
					collapsed: false,
					autogenerate: { directory: "classes/stream", collapsed: true },
				},
				{
					label: "Secret",
					collapsed: false,
					autogenerate: { directory: "classes/secret", collapsed: true },
				},
				{
					label: "Buffer",
					collapsed: false,
					autogenerate: { directory: "classes/buffer", collapsed: true },
				},
				{
					label: "Bit",
					collapsed: false,
					autogenerate: { directory: "classes/bit", collapsed: true },
				},
				{
					label: "Web Socket",
					collapsed: false,
					autogenerate: { directory: "classes/websocket", collapsed: true },
				},
				{
					label: "STD Polyfills",
					collapsed: false,
					autogenerate: { directory: "classes/stdpolyfills", collapsed: true },
				},
				{
					label: "Vendor",
					collapsed: false,
					autogenerate: {
						directory: "vendor",
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
