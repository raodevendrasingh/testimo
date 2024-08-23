export const ExtractDomain = (url: string): string => {
	try {
		const hostname = new URL(url).hostname;
		return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
	} catch (e) {
		console.error("Invalid URL:", url);
		return url;
	}
};
