import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Discord-Luau</span>,
	docsRepositoryBase: "https://github.com/4x8Matrix/Discord-Luau",
	project: {
	  link: 'https://github.com/4x8Matrix/Discord-Luau'
	},

	feedback: {
		useLink() {
			return "https://github.com/4x8Matrix/Discord-Luau/issues/new"
		}
	},

  useNextSeoProps() {
		return {
		  titleTemplate: '%s - Discord Luau'
		}
	},

  chat: {
		link: 'https://discord.com/users/685566749516628033',
	},

  footer: {
		text: (
			<span>
				MIT {new Date().getFullYear()} ©{' '}
				<a href="/" target="_blank">
					Discord-Luau
				</a>
				.
			</span>
		)
	},

  head: (
		<>
			<link rel="shortcut icon" href="/favicons/site.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta property="og:title" content="Discord Luau" />
			<meta property="og:type" content="website" />
			{/* <meta property="og:url" content="https://docs.asyncmatrix.dev/" /> */}
			{/* <meta property="og:image" content="/favicons/waving-hand.png" /> */}
			<meta property="og:description" content="A Luau discord API wrapper." />
			<meta name="theme-color" content="#5865F2" />
		</>
	  )
}

export default config
