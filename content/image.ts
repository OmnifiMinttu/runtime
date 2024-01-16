/**
 * Image structure for content.
 */
interface Image {
	/**
	 * Alternative fallback description or title of the image.
	 */
	alt?: string;
	/**
	 * Path of the image if locally referenced.
	 */
	path?: string;
	/**
	 * URL of the image of served online.
	 */
	url?: string;
}

/**
 * Image source map linking an image reference key to a path.
 */
type ImageSourceMap = { key: string; path?: string }[];

/**
 * Parse an image map and return a map with relevant keys and images.
 *
 * @param imageSource Image source map to parse.
 * @returns Map with key and image objects.
 */
async function parseImageMap(
	imageSource: ImageSourceMap,
): Promise<Map<string, Image>> {
	const images = new Map<string, Image>();

	if (imageSource) {
		await imageSource.forEach((image) =>
			images.set(image.key, { path: image.path })
		);
	}

	return images;
}

export default Image;

export { type Image, type ImageSourceMap, parseImageMap };
