import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
	integrations: [
		starlight({
			title: "Discord Luau",
			logo: {
				src: "./src/assets/logo.png",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/DiscordLuau",
				},
				{
					icon: "discord",
					label: "Discord",
					href: "https://discord.gg/XXpTDNJMPH",
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					autogenerate: { directory: "getting-started" },
				},
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
				{ label: "Discord Luau", autogenerate: { directory: "classes/discordluau" } },
				{ label: "Classes", autogenerate: { directory: "classes/classes", collapsed: true } },
				{ label: "Builders", autogenerate: { directory: "classes/builders", collapsed: true } },
				{ label: "Rest", autogenerate: { directory: "classes/rest" } },
				{ label: "Web Socket", autogenerate: { directory: "classes/websocket" } },
				{ label: "State", autogenerate: { directory: "classes/state" } },
				{ label: "Types", autogenerate: { directory: "classes/types" } },
				{ label: "Std Polyfills", autogenerate: { directory: "classes/stdpolyfills" } },
				{
					label: "Utilities",
					collapsed: true,
					items: [
						{ slug: "classes/bit/bit" },
						{ slug: "classes/buffer/buffer" },
						{ slug: "classes/emitter/emitter" },
						{ slug: "classes/formdata/formdata" },
						{ slug: "classes/logger/logger" },
						{ slug: "classes/secret/secret" },
						{ slug: "classes/snowflake/snowflake" },
						{ slug: "classes/stream/stream" },
						{ slug: "classes/utilities/utilities" },
						{ slug: "classes/voice/voice" },
					],
				},
			],
			components: {
				Header: "./src/components/Header.astro",
				Pagination: "./src/components/Pagination.astro",
			},
			customCss: [
				"./src/styles/landing.css",
				"./src/styles/starlight.css",
				"./src/styles/lua.css",
			],
		}),
	],
});
