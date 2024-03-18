/**
 * Structure representing a CSS asset.
 */
interface Stylesheet {
	/**
	 * URL reference for the CSS.
	 */
	url?: URL;
	/**
	 * Local path of the CSS source.
	 */
	path?: string;
	/**
	 * Body of the CSS content.
	 */
	content?: string;
	/**
	 * Hash of the CSS for integrity and caching.
	 */
	hash?: string;
	/**
	 * Flag determining whether to inline the CSS or link it.
	 */
	inline?: boolean;
}

/**
 * Styles cache provides the storage for CSS content.
 */
class StylesCache {
	/**
	 * List of CSS content.
	 */
	list = new Array<Stylesheet>();

	/**
	 * Appends a stylesheet to the cache.
	 *
	 * @param stylesheet Stylesheet to be cached.
	 */
	append(stylesheet: Stylesheet) {
		this.list.push(stylesheet);
	}
}

export { StylesCache, type Stylesheet };
