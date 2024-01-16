import { FontsCache } from './fonts.ts';
import { StylesCache } from './styles.ts';

/**
 * Handles the styling logic for the application, including caching styling
 * assets such as CSS and fonts.
 */
class StylingMiddleware {
	/**
	 * Provides a singleton instance of the styling middleware.
	 *
	 * @returns Singleton instance of the styling middleware.
	 */
	static instance() {
		if (!StylingMiddleware.#context) {
			StylingMiddleware.#context = new StylingMiddleware();
		}

		return StylingMiddleware.#context;
	}

	/**
	 * Instance of the styling middleware.
	 */
	static #context: StylingMiddleware;

	/**
	 * Fonts cache.
	 */
	fonts = new FontsCache();

	/**
	 * CSS cache.
	 */
	styles = new StylesCache();
}

export default StylingMiddleware;
