import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare({ imageService: "passthrough" }),
	integrations: [
		starlight({
			title: "Discord Luau",
			logo: {
				src: "/src/assets/logo.png",
				replacesTitle: true,
			},
			favicon: "/icon.png",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/DiscordLuau/discord-luau",
				},
				{
					icon: "discord",
					label: "Discord",
					href: "https://discord.gg/DpQwdD8zD3",
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					items: [{ autogenerate: { directory: "getting-started" } }],
				},
				{
					label: "Guides",
					items: [{ autogenerate: { directory: "guides" } }],
				},
				{
					label: "Commands Framework",
					items: [
						{ autogenerate: { directory: "commands-framework" } },
					],
				},
				{
					label: "Discord Luau",
					collapsed: false,
					items: [
						{
							autogenerate: {
								directory: "classes/discordluau",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Classes",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/classes", collapsed: true } },
					],
				},
				{
					label: "Builders",
					collapsed: false,
					items: [
						{
							autogenerate: { directory: "classes/builders", collapsed: true },
						},
					],
				},
				{
					label: "Commands",
					collapsed: false,
					items: [
						{
							autogenerate: {
								directory: "classes/commands",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Types",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/types", collapsed: true } },
					],
				},
				{
					label: "Rest",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/rest", collapsed: true } },
					],
				},
				{
					label: "Voice",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/voice", collapsed: true } },
					],
				},
				{
					label: "Opus",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/opus", collapsed: true } },
					],
				},
				{
					label: "Sodium",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/sodium", collapsed: true } },
					],
				},
				{
					label: "Dave",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/dave", collapsed: true } },
					],
				},
				{
					label: "Accumulator",
					collapsed: false,
					items: [
						{
							autogenerate: {
								directory: "classes/accumulator",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "State",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/state", collapsed: true } },
					],
				},
				{
					label: "Binary",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/binary", collapsed: true } },
					],
				},
				{
					label: "Emitter",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/emitter", collapsed: true } },
					],
				},
				{
					label: "Utilities",
					collapsed: false,
					items: [
						{
							autogenerate: { directory: "classes/utilities", collapsed: true },
						},
					],
				},
				{
					label: "Snowflake",
					collapsed: false,
					items: [
						{
							autogenerate: { directory: "classes/snowflake", collapsed: true },
						},
					],
				},
				{
					label: "Logger",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/logger", collapsed: true } },
					],
				},
				{
					label: "Formdata",
					collapsed: false,
					items: [
						{
							autogenerate: { directory: "classes/formdata", collapsed: true },
						},
					],
				},
				{
					label: "Stream",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/stream", collapsed: true } },
					],
				},
				{
					label: "Secret",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/secret", collapsed: true } },
					],
				},
				{
					label: "Buffer",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/buffer", collapsed: true } },
					],
				},
				{
					label: "Bit",
					collapsed: false,
					items: [
						{ autogenerate: { directory: "classes/bit", collapsed: true } },
					],
				},
				{
					label: "Web Socket",
					collapsed: false,
					items: [
						{
							autogenerate: { directory: "classes/websocket", collapsed: true },
						},
					],
				},
				{
					label: "STD Polyfills",
					collapsed: false,
					items: [
						{
							autogenerate: {
								directory: "classes/stdpolyfills",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Vendor",
					collapsed: false,
					items: [{ autogenerate: { directory: "vendor" } }],
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
