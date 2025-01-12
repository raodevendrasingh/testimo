/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "http",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "media.istockphoto.com",
			},
		],
	},
};

export default nextConfig;
