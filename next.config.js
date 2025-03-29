/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/giris',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
