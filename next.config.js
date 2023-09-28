/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (
		config,
		{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
	  ) => {
		// Important: return the modified config
		config.externals.push({sharp: 'commonjs sharp'})
		return config
	  },
	
}

module.exports = nextConfig
