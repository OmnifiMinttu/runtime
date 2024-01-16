/**
 * Structure representing a font resource for the application.
 */
interface FontResource {
	/**
	 * URL of the font.
	 */
	url?: URL;
	/**
	 * Local path for the font.
	 */
	path?: string;
	/**
	 * Hash of the font.
	 */
	hash?: string;
}

/**
 * Caches fonts for future requests.
 */
class FontsCache {
	/**
	 * List of fonts within the application.
	 */
	list = new Array<FontResource>();

	/**
	 * Appends a font to the cache.
	 *
	 * @param font Font to append to the cache.
	 */
	append(font: FontResource) {
		this.list.push(font);
	}
}

export { type FontResource, FontsCache };
